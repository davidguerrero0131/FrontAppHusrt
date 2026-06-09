import { Injectable } from '@angular/core';

export interface TableState {
    first?: number;
    globalFilter?: string;
    rows?: number;
    // Add more fields if needed
}

@Injectable({
    providedIn: 'root'
})
export class TableStateService {
    private states: { [key: string]: TableState } = {};

    setState(key: string, state: TableState) {
        this.states[key] = { ...this.states[key], ...state };
    }

    getState(key: string): TableState {
        return this.states[key] || { first: 0, globalFilter: '' };
    }

    clearState(key: string) {
        delete this.states[key];
    }
}
