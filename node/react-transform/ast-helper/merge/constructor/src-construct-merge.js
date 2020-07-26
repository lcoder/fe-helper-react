const u = require( '../../util' )
const { NodePath } = require( '@babel/traverse' )
const g = require( '@babel/generator' ).default

/**
 * src有constructor，合并tar的两种方式,state,构造函数
 * @param {NodePath} pathConstructor 
 * @param {*} tar 
 */
function srcConstructMerge( pathConstructor , tar ){
    if ( pathConstructor === undefined
        || pathConstructor === null
        || !(pathConstructor instanceof NodePath)
        || !(pathConstructor.isClassMethod( { kind: 'constructor' } ))
    ) {
        return
    }
    let {
        constructor: tarHasConstrct ,
        stateField: tarHasStateField ,
        tarStateObjNode ,
        cnstrctNode: {
            row , // 函数体节点
            params ,
            stateUp ,
            stateDown ,
        } ,
    } = tar
    // 排除super语句
    stateUp = stateUp
        .filter( node => !u.isSuperExpState( node ) )
    const tarCnstrctNodes = stateUp.concat( stateDown )
    const superPath = u.getSuperPath( pathConstructor )
    const statePath = pathConstructor
        .get( 'body.body' )
        .find( path => u.isThisStateAssign( path ) )
    const srcHasState = statePath !== undefined
    if ( tarHasConstrct ) {
        // state合并
        if ( srcHasState ) {
            const properties = tarStateObjNode ? tarStateObjNode.properties : []
            statePath
                .get( 'expression.right' )
                .pushContainer( 'properties' , properties )
            statePath.insertBefore( stateUp )
            statePath.insertAfter( stateDown )
        } else {
            if ( tarStateObjNode ) {
                const thisStateExpState = u.createThisStateAssignExp( tarStateObjNode )
                superPath.insertAfter( [
                    ...stateUp ,
                    thisStateExpState ,
                    ...stateDown
                ] )
            } else {
                // target和src都没有state，仅合并语句
                pathConstructor
                    .get( 'body' )
                    .pushContainer( 'body' , tarCnstrctNodes )
            }
        }
        // 形参合并
        const srcParamPath = pathConstructor.get('params')
            tarMoreParams = params.length > srcParamPath.length
        if ( tarMoreParams ) {
            pathConstructor.node.params = params
        }
    } else if ( tarHasStateField ) {
        if ( srcHasState ) {
            const properties = tarStateObjNode ? tarStateObjNode.properties : []
            statePath
                .get( 'expression.right' )
                .pushContainer( 'properties' , properties )
        } else {
            if ( tarStateObjNode ) {
                const thisStateExpState = u.createThisStateAssignExp( tarStateObjNode )
                superPath.insertAfter( thisStateExpState )
            } else {
                // do nothing
            }
        }
    } else {
        // do nothing
    }
    // console.log( g( pathConstructor.node ).code )
}


module.exports = srcConstructMerge