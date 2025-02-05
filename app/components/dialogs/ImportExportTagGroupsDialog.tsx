/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import { isFunc } from '@tagspaces/tagspaces-platforms/misc';
import AppConfig from '@tagspaces/tagspaces-platforms/AppConfig';
import TagGroupContainer from '../TagGroupContainer';
import TagContainer from '../TagContainer';
import i18n from '-/services/i18n';
import { TS } from '-/tagspaces.namespace';
import DialogCloseButton from '-/components/dialogs/DialogCloseButton';

// FIXME checkout https://mui.com/components/use-media-query/#using-material-uis-breakpoint-helpers
const withMobileDialog = () => WrappedComponent => props => (
  <WrappedComponent {...props} width="lg" fullScreen={false} />
);

const styles: any = {
  root: {
    width: 400,
    height: '100%',
    overflowY: AppConfig.isFirefox ? 'auto' : 'overlay',
    marginBottom: 30
  }
};

interface Props {
  classes: any;
  open: boolean;
  tagGroups: Array<any>;
  fullScreen: boolean;
  onClose: () => void;
  dialogModeImport: boolean;
  showNotification?: (text: string) => void;
  importTagGroups: (taggroup: any) => void;
  exportTagGroups: (taggroup: any) => void;
}

function ImportExportTagGroupsDialog(props: Props) {
  // const [selectedAll, setSelectedAll] = useState<boolean>(true);
  const selectedAll = useRef(true);
  const [tagGroupList, setTagGroupList] = useState<Array<any>>(
    props.tagGroups.map(entry => ({ ...entry, selected: selectedAll.current }))
  );

  const handleToggleSelectAll = () => {
    selectedAll.current = !selectedAll.current;
    setTagGroupList(
      tagGroupList.map(entry => ({ ...entry, selected: selectedAll.current }))
    );
  };

  const isSelected = () => tagGroupList.some(n => n.selected === true);

  const handleTagGroup = (tagGroup: any, checked: boolean, index) => {
    setTagGroupList([
      ...tagGroupList.slice(0, index),
      {
        ...tagGroupList[index],
        selected: !checked
      },
      ...tagGroupList.slice(index + 1)
    ]);
  };

  const onConfirm = () => {
    const { showNotification } = props;
    const groupList = tagGroupList.filter(tagGroup => tagGroup.selected);
    props.onClose();
    if (props.dialogModeImport) {
      props.importTagGroups(groupList);
      if (isFunc(showNotification)) {
        showNotification(i18n.t('core:successfullyImportedGroupTags'));
      }
    } else {
      props.exportTagGroups(groupList);
      if (isFunc(showNotification)) {
        showNotification(i18n.t('core:successfullyExportedGroupTags'));
      }
    }
  };

  const renderTagGroups = (tagGroup, index) => (
    <div key={tagGroup.uuid || tagGroup.key}>
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                id={tagGroup.uuid || tagGroup.key}
                checked={tagGroup.selected}
                onClick={e => handleTagGroup(e, tagGroup.selected, index)}
                // onChange={e => handleChange(e)}
                value={tagGroup.title}
                name={tagGroup.title}
              />
            }
            label={tagGroup.title}
          />
        </FormGroup>
      </FormControl>
      <TagGroupContainer taggroup={tagGroup}>
        {tagGroup.children &&
          tagGroup.children.map((tag: TS.Tag) => (
            <TagContainer tag={tag} tagMode="display" />
          ))}
      </TagGroupContainer>
    </div>
  );

  const renderTitle = () => (
    <DialogTitle>
      {props.dialogModeImport
        ? i18n.t('core:importGroupTagsTitle')
        : i18n.t('core:exportGroupTagsTitle')}
      <DialogCloseButton onClose={onClose} />
    </DialogTitle>
  );

  const renderContent = () => (
    <DialogContent className={props.classes.root}>
      <Button color="primary" onClick={handleToggleSelectAll}>
        {i18n.t('core:selectAllTagGroups')}
      </Button>
      <FormControl fullWidth={true}>
        {tagGroupList.map(renderTagGroups)}
      </FormControl>
    </DialogContent>
  );

  const renderActions = () => (
    <DialogActions>
      <Button onClick={props.onClose}>{i18n.t('core:cancel')}</Button>
      <Button
        disabled={!isSelected()}
        onClick={onConfirm}
        data-tid="confirmImportExport"
        color="primary"
      >
        {props.dialogModeImport ? 'Import' : 'Export'}
      </Button>
    </DialogActions>
  );

  const { onClose, open, fullScreen } = props;
  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      onClose={onClose}
      // onEnterKey={(event) => onEnterKeyHandler(event, this.onConfirm)}
    >
      {renderTitle()}
      {renderContent()}
      {renderActions()}
    </Dialog>
  );
}

export default withMobileDialog()(
  withStyles(styles)(ImportExportTagGroupsDialog)
);
