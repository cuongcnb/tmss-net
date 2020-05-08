export const focusedCells: Array<any> = [];
export let currentTab;
export const setFocusedCell = (params: any, tab: any, editing?): void => {
    for (const cell of focusedCells) {
        if (cell.tab === tab) {
            cell.focusCellParams = params;
            cell.focusCell = params.api.getFocusedCell();
            cell.tab = tab ? tab : null;
            cell.editing = editing != null ? editing : true;
            return;
        }
    }

    focusedCells.push({
        focusCellParams: params,
        focusCell: params.api.getFocusedCell(),
        tab: tab ? tab : null,
        editing: editing != null ? editing : true
    });
};

export const setCurrentTab = (tab) => {
    currentTab = tab;
};
