// этакая база данных приложухи
export type Board = {
    stages: Stage[],
}

export type Stage = {
    name: string,
    items: Item[],
}

export type Item = {
    id: string,
    name: string,
    desc: string,
    deadline: number,
    // color: string,
    // complete: string,
    updated: number,
    created: number,
}
