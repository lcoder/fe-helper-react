const g = require( '@babel/generator' ).default
const u = require( '../../util' )
const t = require( '@babel/types' )
const srcConstructMerge = require( './src-construct-merge' )

/**
 * 合并构造函数的内容，区分四种情况
 * @param {*} path 
 * @param {*} state 
 */
function mergeConstructor( path , state ){
    const bodys = path
        .get( 'body' )
    const pathStateField = bodys
            .find( path => {
                return path.isClassProperty()
                    && path.node.static === false
                    && path.get("key").isIdentifier( { name: 'state' } )
                    && path.get("value").isObjectExpression()
            } )
    const pathConstructor = bodys
        .find( path => {
            return path.node.static === false
                && path.isClassMethod( { kind: 'constructor' } )
        } )
    const srcHasStateField = pathStateField !== undefined
    const srcHasConstrct = pathConstructor !== undefined
    let {
            tar: {
                constructor: tarHasConstrct ,
                stateField: tarHasStateField ,
                tarStateObjNode ,
            }
        } = state
    if ( srcHasConstrct ) {
        srcConstructMerge( pathConstructor , state.tar )
    } else if ( srcHasStateField ) {
        if ( tarHasConstrct ) {
            // 创建 src 的构造函数
            const srcStateObjPath = pathStateField.get( 'value' )
            const newConstructNode = u.createConstruct( [
                u.createSuperCallState() ,
                u.createThisStateAssignExp(
                    srcStateObjPath.isObjectExpression() ? srcStateObjPath.node :
                    t.objectExpression([])
                )
            ] )
            // 使用构造函数 替换 state实例属性
            pathStateField.replaceWith( newConstructNode )
            // 走上面srcHasConstrct为true的逻辑
            const pathConstructor = bodys
                .find( path => {
                    return path.node.static === false
                        && path.isClassMethod( { kind: 'constructor' } )
                } )
            srcConstructMerge( pathConstructor , state.tar )
        } else if ( tarHasStateField ) {
            // 两个对象合并
            const properties = tarStateObjNode ? tarStateObjNode.properties : []
            pathStateField
                .get( 'value' )
                .pushContainer( 'properties' , properties )
        } else {
            // do nothing
        }
    } else {
        // do nothing
    }
}



module.exports = mergeConstructor