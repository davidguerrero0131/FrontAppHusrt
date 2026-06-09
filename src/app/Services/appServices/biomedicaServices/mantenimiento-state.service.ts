import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MantenimientoStateService {
    private state = {
        anio: new Date().getFullYear(),
        mesInicio: new Date().getMonth() + 1,
        mesFin: new Date().getMonth() + 1,
        activePanel: 'preventivos' as 'preventivos' | 'correctivos' | 'metas',
        metasSubPanel: 'realizados' as 'realizados' | 'pendientes',
        tableFirst: 0,
        globalFilter: ''
    };

    setState(newState: Partial<typeof this.state>) {
        this.state = { ...this.state, ...newState };
    }

    getState() {
        return this.state;
    }

    reset() {
        this.state = {
            anio: new Date().getFullYear(),
            mesInicio: new Date().getMonth() + 1,
            mesFin: new Date().getMonth() + 1,
            activePanel: 'preventivos',
            metasSubPanel: 'realizados',
            tableFirst: 0,
            globalFilter: ''
        };
    }
}
