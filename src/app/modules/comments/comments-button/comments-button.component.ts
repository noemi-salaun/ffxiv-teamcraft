import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CommentsPopupComponent} from '../comments-popup/comments-popup.component';
import {ListRow} from '../../../model/list/list-row';
import {List} from '../../../model/list/list';
import {ObservableMedia} from '@angular/flex-layout';
import {SettingsService} from '../../../pages/settings/settings.service';

@Component({
    selector: 'app-comments-button',
    templateUrl: './comments-button.component.html',
    styleUrls: ['./comments-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsButtonComponent implements OnInit {

    @Input()
    row: ListRow;

    @Input()
    list: List;

    @Input()
    name: string;

    @Input()
    isOwnList = false;

    amount: number;

    constructor(private dialog: MatDialog, private media: ObservableMedia, public settings: SettingsService) {
    }

    openPopup(): void {
        this.dialog.open(CommentsPopupComponent, {data: {name: this.name, row: this.row, list: this.list, isOwnList: this.isOwnList}});
    }

    ngOnInit(): void {
        this.amount = this.row.comments === undefined ? 0 : this.row.comments.length;
    }

    isMobile(): boolean {
        return this.media.isActive('xs') || this.media.isActive('sm');
    }

}
