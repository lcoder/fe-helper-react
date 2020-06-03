import React, { createContext, Context } from 'react';
import { useLocalStore, observer } from 'mobx-react';

interface Project {
    name: string,
    code: string,
}

export interface StoreTypes {
    count: number,
    projects: Array<Project>,
}

const initValues: StoreTypes = {
    count: 0,
    projects: [],
}

export const StoreContext: Context<StoreTypes> = createContext( initValues );

export const StoreProvider = observer( (props: any) => {
    const store = useLocalStore( () => ({
        count: 1,
        projects: [
            { name: '夸父', code: 'kuafu' },
            { name: '诺亚', code: 'noah' },
        ],
        get getCount(){
            return store.count;
        },
        handleCount(){
            store.count++;
        }
    }) );
    return <StoreContext.Provider value={store}>
        {props.children}
    </StoreContext.Provider>
});