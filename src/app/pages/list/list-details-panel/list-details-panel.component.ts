import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ListRow} from '../../../model/list/list-row';
import {List} from '../../../model/list/list';
import {SettingsService} from '../../settings/settings.service';

@Component({
    selector: 'app-list-details-panel',
    templateUrl: './list-details-panel.component.html',
    styleUrls: ['./list-details-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDetailsPanelComponent implements OnChanges, OnInit {

    @Input()
    title: string;

    @Input()
    data: ListRow[];

    @Input()
    list: List;

    @Input()
    recipe = false;

    @Input()
    preCraft = false;

    @Input()
    showTier = false;

    @Output()
    done: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    update: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    expanded = true;

    @Output()
    opened: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    closed: EventEmitter<void> = new EventEmitter<void>();

    tiers: ListRow[][] = [[]];

    constructor(public settings: SettingsService) {
    }

    /**
     * Returns a list of tiers based on dependencies between each list row.
     * each tier is a list of rows.
     */
    public generateTiers(): void {
        if (this.data !== null) {

            this.tiers = [[]];
            this.topologicalSort(this.data).forEach(row => {
                if (row.requires !== undefined) {
                    this.tiers = this.setTier(row, this.tiers);
                }
            });
        }
    }

    private topologicalSort(data: ListRow[]): ListRow[] {
        const res: ListRow[] = [];
        const doneList: boolean[] = [];
        while (data.length > res.length) {
            let resolved = false;

            for (const item of data) {
                if (res.indexOf(item) > -1) {
                    // item already in resultset
                    continue;
                }
                resolved = true;

                if (item.requires !== undefined) {
                    for (const dep of item.requires) {
                        // We have to check if it's not a precraft, as some dependencies aren't resolvable inside the current array.
                        const depIsInArray = data.find(row => row.id === dep.id) !== undefined;
                        if (!doneList[dep.id] && depIsInArray) {
                            // there is a dependency that is not met:
                            resolved = false;
                            break;
                        }
                    }
                }
                if (resolved) {
                    // All dependencies are met:
                    doneList[item.id] = true;
                    res.push(item);
                }
            }
        }
        return res;
    }

    private setTier(row: ListRow, result: ListRow[][]): ListRow[][] {
        if (result[0] === undefined) {
            result[0] = [];
        }
        // Default tier is -1, because we want to do +1 to the last requirement tier to define the tier of the current item.
        let requirementsTier = -1;
        for (const requirement of row.requires) {
            for (let tier = 0; tier < result.length; tier++) {
                if (result[tier].find(r => r.id === requirement.id) !== undefined) {
                    requirementsTier = requirementsTier > tier ? requirementsTier : tier;
                }
            }
        }
        const itemTier = requirementsTier + 1;
        if (result[itemTier] === undefined) {
            result[itemTier] = [];
        }
        result[itemTier].push(row);
        return result;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.showTier && changes.list !== undefined && changes.list.previousValue !== changes.list.currentValue) {
            this.generateTiers();
        }
    }

    ngOnInit(): void {
        if (this.showTier) {
            this.generateTiers();
        }
    }
}
