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

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import DocumentationIcon from '@mui/icons-material/Help';
import LocationIcon from '@mui/icons-material/WorkOutline';
import ChangeLogIcon from '@mui/icons-material/ImportContacts';
import WebClipperIcon from '@mui/icons-material/Transform';
import EmailIcon from '@mui/icons-material/Email';
import IssueIcon from '@mui/icons-material/BugReport';
import TranslationIcon from '@mui/icons-material/Translate';
import NewFeatureIcon from '@mui/icons-material/Gesture';
import SocialIcon from '@mui/icons-material/ThumbUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import KeyShortcutsIcon from '@mui/icons-material/Keyboard';
import WelcomeBackground from '../assets/images/background.png';
import WelcomeLogo from '../assets/images/welcome-logo.png';
import { actions as AppActions } from '../reducers/app';
import i18n from '../services/i18n';
import {
  isFirstRun,
  getDesktopMode,
  actions as SettingsActions
} from '../reducers/settings';
import Links from '../links';

const styles: any = (theme: any) => ({
  mainPanel: {
    flex: '1 1 100%',
    width: '100%',
    height: '100%',
    overflowY: 'hidden',
    backgroundColor: theme.palette.background.default,
    backgroundImage: 'url(' + WelcomeBackground + ')',
    backgroundRepeat: 'repeat',
    opacity: '0.4'
  },
  slogan: {
    top: '45%',
    width: '100%',
    textAlign: 'center',
    position: 'absolute'
  },
  links: {
    width: 300,
    height: 'calc(100% - 100px)',
    margin: 'auto',
    marginTop: 15,
    marginBottom: 15,
    overflowY: 'overlay',
    backgroundColor: theme.palette.background.default
  }
});

interface Props {
  classes: any;
  toggleKeysDialog: () => void;
  openURLExternally: (url: string, skipConfirmation?: boolean) => void;
  toggleAboutDialog: () => void;
  isDesktopMode: boolean;
}

function WelcomePanel(props: Props) {
  const { classes, openURLExternally, toggleKeysDialog, isDesktopMode } = props;
  return (
    <div className={classes.mainPanel}>
      <List
        dense={false}
        component="nav"
        aria-label="main help area"
        className={classes.links}
      >
        <div
          role="button"
          aria-hidden="true"
          tabIndex={0}
          onClick={props.toggleAboutDialog}
        >
          <img src={WelcomeLogo} alt="Organize your files" />
        </div>
        {/* <ListItem
          button
          onClick={() => {
            const button = document.getElementById(
              isDesktopMode ? 'locationMenuButton' : 'mobileMenuButton'
            );
            button.click();
          }}
        >
          <Button startIcon={<LocationIcon />}>
            {i18n.t('core:chooseLocation')}
          </Button>
        </ListItem> */}
        <ListItem
          button
          onClick={() =>
            openURLExternally(Links.documentationLinks.general, true)
          }
        >
          <Button startIcon={<DocumentationIcon />}>
            {i18n.t('documentation')}
          </Button>
        </ListItem>
        <ListItem button onClick={() => toggleKeysDialog()}>
          <Button startIcon={<KeyShortcutsIcon />}>
            {i18n.t('core:shortcutKeys')}
          </Button>
        </ListItem>
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.changelogURL, true)}
        >
          <Button
            startIcon={<ChangeLogIcon />}
            title="Opens the changelog of the app"
          >
            {i18n.t('core:whatsNew')}
          </Button>
        </ListItem>
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.webClipper, true)}
        >
          <Button startIcon={<WebClipperIcon />}>
            {i18n.t('core:webClipper')}
          </Button>
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.suggestFeature, true)}
        >
          <Button startIcon={<NewFeatureIcon />}>
            {i18n.t('core:suggestNewFeatures')}
          </Button>
        </ListItem>
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.reportIssue, true)}
        >
          <Button startIcon={<IssueIcon />}>
            {i18n.t('core:reportIssues')}
          </Button>
        </ListItem>
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.helpTranslating)}
        >
          <Button startIcon={<TranslationIcon />}>
            {i18n.t('core:helpWithTranslation')}
          </Button>
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => openURLExternally(Links.links.emailContact, true)}
        >
          <Button startIcon={<EmailIcon />}>
            {i18n.t('core:emailContact')}
          </Button>
        </ListItem>
        <ListItem button onClick={() => openURLExternally(Links.links.twitter)}>
          <Button startIcon={<TwitterIcon />}>
            {i18n.t('core:followOnTwitter')}
          </Button>
        </ListItem>
        {/* <ListItem
          button
          onClick={() => openURLExternally(Links.links.facebook)}
        >
          <Button startIcon={<SocialIcon />}>
            {i18n.t('core:likeUsOnFacebook')}
          </Button>
        </ListItem> */}
      </List>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isFirstRun: isFirstRun(state),
    isDesktopMode: getDesktopMode(state)
  };
}

function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(
    {
      setFirstRun: SettingsActions.setFirstRun,
      openURLExternally: AppActions.openURLExternally,
      toggleKeysDialog: AppActions.toggleKeysDialog,
      toggleAboutDialog: AppActions.toggleAboutDialog
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(withStyles(styles)(WelcomePanel));
