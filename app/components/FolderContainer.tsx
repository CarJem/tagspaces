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

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AdvancedSearchIcon from '@mui/icons-material/FilterAlt';
import MenuIcon from '@mui/icons-material/MenuOpen';
import Badge from '@mui/material/Badge';
import withStyles from '@mui/styles/withStyles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AppConfig from '@tagspaces/tagspaces-platforms/AppConfig';
import LocationMenu from './menus/LocationMenu';
import i18n from '../services/i18n';
import {
  getMaxSearchResults,
  getDesktopMode,
  getCurrentLanguage,
  getDefaultPerspective
} from '-/reducers/settings';

import {
  actions as AppActions,
  getDirectoryContent,
  getSearchResultCount,
  isReadOnlyMode,
  getCurrentLocationPath,
  getCurrentDirectoryPerspective,
  OpenedEntry,
  getSelectedEntries,
  getProgress,
  getCurrentDirectoryFiles,
  getCurrentDirectoryDirs
} from '../reducers/app';
import TaggingActions from '../reducers/tagging-actions';
import LoadingLazy from '../components/LoadingLazy';
import { Pro } from '../pro';
import RenameEntryDialog from '-/components/dialogs/RenameEntryDialog';
import { TS } from '-/tagspaces.namespace';
import PathBreadcrumbs from './PathBreadcrumbs';
import { enhanceOpenedEntry } from '-/services/utils-io';
import SearchInline from '-/components/SearchInline';
import SearchPopover from '-/components/SearchPopover';
import {
  actions as LocationIndexActions,
  getSearchQuery
} from '-/reducers/location-index';
import Links from '-/links';
import { PerspectiveIDs, AvailablePerspectives } from '-/perspectives';
import MainSearchField from '-/components/MainSearchField';
import LoadingAnimation from '-/components/LoadingAnimation';

const GridPerspective = React.lazy(() =>
  import(
    /* webpackChunkName: "GridPerspective" */ '../perspectives/grid-perspective'
  )
);
function GridPerspectiveAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <GridPerspective {...props} />
    </React.Suspense>
  );
}

const ListPerspective = React.lazy(() =>
  import(/* webpackChunkName: "ListPerspective" */ '../perspectives/list')
);
function ListPerspectiveAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <ListPerspective {...props} />
    </React.Suspense>
  );
}

let GalleryPerspective = React.Fragment;
if (Pro && Pro.Perspectives && Pro.Perspectives.GalleryPerspective) {
  // GalleryPerspective = React.lazy(() => import(/* webpackChunkName: "GalleryPerspective" */ '../node_modules/@tagspaces/pro/modules/perspectives/gallery'));

  GalleryPerspective = Pro.Perspectives.GalleryPerspective;
}
function GalleryPerspectiveAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <GalleryPerspective {...props} />
    </React.Suspense>
  );
}

let MapiquePerspective = React.Fragment;
if (Pro && Pro.Perspectives && Pro.Perspectives.MapiquePerspective) {
  // MapiquePerspective = React.lazy(() => import(/* webpackChunkName: "MapiquePerspective" */ '../node_modules/@tagspaces/pro/modules/perspectives/mapique'));
  MapiquePerspective = Pro.Perspectives.MapiquePerspective;
}
function MapiquePerspectiveAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <MapiquePerspective {...props} />
    </React.Suspense>
  );
}

/* let TreeVizPerspective = React.Fragment;
if (Pro && Pro.Perspectives && Pro.Perspectives.TreeVizPerspective) {
  // TreeVizPerspective = React.lazy(() => import(/!* webpackChunkName: "TreeVizPerspective" *!/ '../node_modules/@tagspaces/pro/modules/perspectives/treeviz'));
  // eslint-disable-next-line prefer-destructuring
  TreeVizPerspective = Pro.Perspectives.TreeVizPerspective;
}
const TreeVizPerspectiveAsync = props => (
  <React.Suspense fallback={<LoadingLazy />}>
    <TreeVizPerspective {...props} />
  </React.Suspense>
); */

let KanBanPerspective = React.Fragment;
if (Pro && Pro.Perspectives && Pro.Perspectives.KanBanPerspective) {
  KanBanPerspective = Pro.Perspectives.KanBanPerspective;
}
function KanBanPerspectiveAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <KanBanPerspective {...props} />
    </React.Suspense>
  );
}

// let WikiPerspective = React.Fragment;
// if (Pro && Pro.Perspectives && Pro.Perspectives.WikiPerspective) {
//   WikiPerspective = Pro.Perspectives.WikiPerspective;
// }
// function WikiPerspectiveAsync(props) {
//   return (
//     <React.Suspense fallback={<LoadingLazy />}>
//       <WikiPerspective {...props} />
//     </React.Suspense>
//   );
// }

const WelcomePanel = React.lazy(() =>
  import(/* webpackChunkName: "WelcomePanel" */ './WelcomePanel')
);
function WelcomePanelAsync(props) {
  return (
    <React.Suspense fallback={<LoadingLazy />}>
      <WelcomePanel {...props} />
    </React.Suspense>
  );
}

const CounterBadge: any = withStyles(theme => ({
  badge: {
    top: '50%',
    right: -15,
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[900]
        : theme.palette.grey[200],
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
  }
}))(Badge);

const CustomButton: any = withStyles(theme => ({
  root: {
    // borderRadius: 15,
    // minWidth: 45,
    // height: 40
  }
}))(IconButton);

interface Props {
  classes: any;
  settings: any;
  theme: any;
  windowHeight: number;
  windowWidth: number;
  directoryContent: Array<Object>;
  currentDirectoryFiles: Array<any>;
  currentDirectoryDirs: Array<any>;
  currentDirectoryPath: string | null;
  searchResultCount: number;
  addTags: () => void;
  removeTags: () => void;
  removeAllTags: () => void;
  editTagForEntry: () => void;
  renameFile: () => void;
  openDirectory: () => void;
  showInFileManager: () => void;
  openFsEntry: (fsEntry: TS.FileSystemEntry) => void;
  reflectCreateEntry: (path: string, isFile: boolean) => void;
  loadDirectoryContent: (
    path: string,
    generateThumbnails: boolean,
    loadDirMeta?: boolean
  ) => void;
  loadParentDirectoryContent: () => void;
  setSelectedEntries: (selectedEntries: Array<Object>) => void;
  isReadOnlyMode: boolean;
  isDesktopMode: boolean;
  showNotification: (content: string) => void;
  toggleDrawer?: () => void;
  drawerOpened: boolean;
  setCurrentDirectoryPerspective: (perspective: string) => void;
  maxSearchResults: number;
  defaultPerspective: string;
  currentDirectoryPerspective: string;
  currentLocationPath: string;
  openedFiles: Array<OpenedEntry>;
  updateCurrentDirEntry: (path: string, entry: Object) => void;
  setCurrentDirectoryColor: (color: string) => void;
  selectedEntries: Array<TS.FileSystemEntry>;
  toggleUploadDialog: () => void;
  progress?: Array<any>;
  searchQuery: TS.SearchQuery;
  setSearchQuery: (searchQuery: TS.SearchQuery) => void;
  openCurrentDirectory: () => void;
  openURLExternally?: (url: string, skipConfirmation: boolean) => void;
  language: string;
  // keyBindings: Array<any>;
}

function FolderContainer(props: Props) {
  useEffect(() => {
    setSearchVisible(false);
  }, [props.currentDirectoryPath]);

  useEffect(() => {
    if (props.selectedEntries.length < 2) {
      if (props.openedFiles.length > 0) {
        const openedFile = props.openedFiles[0];
        if (openedFile.path === props.currentDirectoryPath) {
          if (openedFile.color) {
            props.setCurrentDirectoryColor(openedFile.color);
          } else if (openedFile.color === undefined) {
            props.setCurrentDirectoryColor(undefined);
          }
          if (openedFile.perspective) {
            props.setCurrentDirectoryPerspective(openedFile.perspective);
          }
        } else {
          const currentEntry = enhanceOpenedEntry(
            openedFile,
            props.settings.tagDelimiter
          );
          props.updateCurrentDirEntry(openedFile.path, currentEntry);
        }
      }
    }
  }, [props.openedFiles]);

  useEffect(() => {
    if (!props.searchQuery || Object.keys(props.searchQuery).length === 0) {
      setSearchVisible(false);
    } else {
      setSearchVisible(true);
    }
  }, [props.searchQuery]);

  const [isRenameEntryDialogOpened, setIsRenameEntryDialogOpened] = useState<
    boolean
  >(false);
  const [isSearchVisible, setSearchVisible] = useState<boolean>(false);
  // const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const [anchorSearch, setAnchorSearch] = useState<HTMLButtonElement | null>(
    null
  );

  const {
    currentDirectoryPath = '',
    loadDirectoryContent,
    directoryContent,
    // searchResultCount,
    classes,
    // maxSearchResults,
    toggleDrawer,
    drawerOpened,
    isDesktopMode,
    theme,
    currentDirectoryPerspective,
    currentLocationPath,
    setSelectedEntries,
    openDirectory,
    reflectCreateEntry,
    openFsEntry,
    // keyBindings,
    defaultPerspective
  } = props;

  let currentPerspective =
    currentDirectoryPerspective || defaultPerspective || PerspectiveIDs.GRID;

  if (currentPerspective === PerspectiveIDs.UNSPECIFIED) {
    currentPerspective = defaultPerspective;
  }

  const showWelcomePanel = !currentDirectoryPath && directoryContent.length < 1;

  const renderPerspective = () => {
    if (showWelcomePanel) {
      return AppConfig.showWelcomePanel ? <WelcomePanelAsync /> : null;
    }
    if (currentPerspective === PerspectiveIDs.LIST) {
      return (
        <ListPerspectiveAsync
          directoryContent={props.directoryContent}
          loadDirectoryContent={props.loadDirectoryContent}
          openFsEntry={props.openFsEntry}
          openRenameEntryDialog={() => setIsRenameEntryDialogOpened(true)}
          loadParentDirectoryContent={props.loadParentDirectoryContent}
          renameFile={props.renameFile}
          openDirectory={props.openDirectory}
          showInFileManager={props.showInFileManager}
          currentDirectoryPath={props.currentDirectoryPath}
          addTags={props.addTags}
          editTagForEntry={props.editTagForEntry}
          removeTags={props.removeTags}
          removeAllTags={props.removeAllTags}
          windowWidth={props.windowWidth}
        />
      );
    }
    if (Pro && currentPerspective === PerspectiveIDs.GALLERY) {
      return (
        <GalleryPerspectiveAsync
          directoryContent={props.directoryContent}
          openFsEntry={props.openFsEntry}
          currentDirectoryPath={props.currentDirectoryPath}
          windowWidth={props.windowWidth}
          switchPerspective={switchPerspective}
        />
      );
    }
    if (Pro && currentPerspective === PerspectiveIDs.MAPIQUE) {
      return (
        <MapiquePerspectiveAsync
          directoryContent={props.directoryContent}
          currentDirectoryPath={props.currentDirectoryPath}
          windowWidth={props.windowWidth}
          switchPerspective={switchPerspective}
          openedFiles={props.openedFiles}
        />
      );
    }
    if (Pro && currentPerspective === PerspectiveIDs.KANBAN) {
      return (
        <KanBanPerspectiveAsync
          directoryContent={props.directoryContent}
          currentDirectoryFiles={props.currentDirectoryFiles}
          currentDirectoryDirs={props.currentDirectoryDirs}
          loadDirectoryContent={props.loadDirectoryContent}
          openFsEntry={props.openFsEntry}
          openRenameEntryDialog={() => setIsRenameEntryDialogOpened(true)}
          loadParentDirectoryContent={props.loadParentDirectoryContent}
          renameFile={props.renameFile}
          openDirectory={props.openDirectory}
          showInFileManager={props.showInFileManager}
          currentDirectoryPath={props.currentDirectoryPath}
          addTags={props.addTags}
          editTagForEntry={props.editTagForEntry}
          removeTags={props.removeTags}
          removeAllTags={props.removeAllTags}
          windowWidth={props.windowWidth}
          switchPerspective={switchPerspective}
        />
      );
    }
    // if (Pro && currentPerspective === PerspectiveIDs.WIKI) {
    //   return (
    //     <WikiPerspectiveAsync
    //       directoryContent={props.directoryContent}
    //       loadDirectoryContent={props.loadDirectoryContent}
    //       openFsEntry={props.openFsEntry}
    //       openRenameEntryDialog={() => setIsRenameEntryDialogOpened(true)}
    //       loadParentDirectoryContent={props.loadParentDirectoryContent}
    //       renameFile={props.renameFile}
    //       openDirectory={props.openDirectory}
    //       showInFileManager={props.showInFileManager}
    //       currentDirectoryPath={props.currentDirectoryPath}
    //       addTags={props.addTags}
    //       editTagForEntry={props.editTagForEntry}
    //       removeTags={props.removeTags}
    //       removeAllTags={props.removeAllTags}
    //       windowWidth={props.windowWidth}
    //     />
    //   );
    // }
    return (
      <GridPerspectiveAsync
        directoryContent={props.directoryContent}
        loadDirectoryContent={props.loadDirectoryContent}
        openFsEntry={props.openFsEntry}
        openRenameEntryDialog={() => setIsRenameEntryDialogOpened(true)}
        loadParentDirectoryContent={props.loadParentDirectoryContent}
        renameFile={props.renameFile}
        openDirectory={props.openDirectory}
        showInFileManager={props.showInFileManager}
        currentDirectoryPath={props.currentDirectoryPath}
        addTags={props.addTags}
        editTagForEntry={props.editTagForEntry}
        removeTags={props.removeTags}
        removeAllTags={props.removeAllTags}
        windowWidth={props.windowWidth}
      />
    );
  };

  function CircularProgressWithLabel(prop) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress size={24} variant="determinate" {...prop} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            style={{ color: theme.palette.text.primary, fontSize: 8 }}
          >
            {`${prop.value}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const getProgressValue = () => {
    const objProgress = props.progress.find(
      fileProgress => fileProgress.progress < 100 && fileProgress.progress > -1
    );
    if (objProgress !== undefined) {
      return objProgress.progress;
    }
    return 100;
  };

  const switchPerspective = (perspectiveId: string) => {
    if (
      Pro ||
      perspectiveId === PerspectiveIDs.GRID ||
      perspectiveId === PerspectiveIDs.LIST
    ) {
      props.setCurrentDirectoryPerspective(perspectiveId);
    } else if (perspectiveId === PerspectiveIDs.GALLERY) {
      const openPersDocs = window.confirm(i18n.t('perspectiveInPro'));
      if (openPersDocs) {
        props.openURLExternally(
          Links.documentationLinks.galleryPerspective,
          true
        );
      }
    } else if (perspectiveId === PerspectiveIDs.MAPIQUE) {
      const openPersDocs = window.confirm(i18n.t('perspectiveInPro'));
      if (openPersDocs) {
        props.openURLExternally(
          Links.documentationLinks.mapiquePerspective,
          true
        );
      }
    } else if (perspectiveId === PerspectiveIDs.KANBAN) {
      const openPersDocs = window.confirm(i18n.t('perspectiveInPro'));
      if (openPersDocs) {
        props.openURLExternally(
          Links.documentationLinks.kanbanPerspective,
          true
        );
      }
      // } else if (perspectiveId === PerspectiveIDs.WIKI) {
      //   const openPersDocs = window.confirm(i18n.t('perspectiveInPro'));
      //   if (openPersDocs) {
      //     props.openURLExternally(
      //       Links.documentationLinks.kanbanPerspective,
      //       true
      //     );
      //   }
    }
  };

  const perspectiveToggleButtons = [];
  AvailablePerspectives.forEach(perspective => {
    if (perspective.beta === false) {
      perspectiveToggleButtons.push(
        <ToggleButton
          value={perspective.id}
          aria-label={perspective.id}
          key={perspective.id}
          data-tid={perspective.key}
          onClick={() => switchPerspective(perspective.id)}
        >
          <Tooltip arrow title={perspective.title}>
            <div style={{ display: 'flex' }}>{perspective.icon}</div>
          </Tooltip>
        </ToggleButton>
      );
    }
  });

  return (
    <div data-tid="folderContainerTID" style={{ position: 'relative' }}>
      <div
        style={{
          flex: '1 1 100%',
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            paddingLeft: 5,
            display: 'flex',
            overflowY: 'hidden',
            // @ts-ignore
            overflowX: AppConfig.isFirefox ? 'auto' : 'overlay'
          }}
        >
          <CustomButton
            id="mobileMenuButton"
            style={{
              transform: drawerOpened ? 'rotate(0deg)' : 'rotate(180deg)',
              width: 50
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </CustomButton>
          {isSearchVisible ? (
            <>
              <SearchInline />
              <Tooltip title={i18n.t('core:advancedSearch')}>
                <CustomButton
                  id="advancedButton"
                  data-tid="advancedSearch"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    setAnchorSearch(event.currentTarget)
                  }
                >
                  <AdvancedSearchIcon />
                </CustomButton>
              </Tooltip>
              <Popover
                open={Boolean(anchorSearch)}
                anchorEl={anchorSearch}
                onClose={() => setAnchorSearch(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                PaperProps={{
                  style: {
                    overflow: 'hidden',
                    height: 720
                  }
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <SearchPopover onClose={() => setAnchorSearch(null)} />
              </Popover>
            </>
          ) : (
            <>
              <div
                style={{
                  flex: '1 1 10%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              />
              <Tooltip
                title={
                  i18n.t('showSearch') + ' (CTRL/⌘ + SHIFT + F)'
                  // +
                  // ' - ' +
                  // keyBindings['openSearch'].toUpperCase()
                }
              >
                <MainSearchField
                  fullWidth
                  data-tid="toggleSearch"
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  style={{
                    marginTop: 10,
                    minWidth: 40,
                    width: 200
                  }}
                  onKeyDown={() => setSearchVisible(!isSearchVisible)}
                  onClick={() => setSearchVisible(!isSearchVisible)}
                  margin="dense"
                  placeholder={i18n.t('core:searchTitle')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ marginRight: 0 }}
                      >
                        <IconButton size="small" edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Tooltip>
              {props.progress && props.progress.length > 0 && (
                <CustomButton
                  id="progressButton"
                  title={i18n.t('core:progress')}
                  data-tid="uploadProgress"
                  onClick={() => props.toggleUploadDialog()}
                  className={[classes.button, classes.upgradeButton].join(' ')}
                >
                  <CircularProgressWithLabel value={getProgressValue()} />
                </CustomButton>
              )}
              <LocationMenu />
              <PathBreadcrumbs
                currentDirectoryPath={currentDirectoryPath}
                currentLocationPath={currentLocationPath}
                loadDirectoryContent={loadDirectoryContent}
                switchPerspective={switchPerspective}
                setSelectedEntries={setSelectedEntries}
                openDirectory={openDirectory}
                reflectCreateEntry={reflectCreateEntry}
                openFsEntry={openFsEntry}
                isReadOnlyMode={props.isReadOnlyMode}
                isDesktopMode={isDesktopMode}
                openRenameDirectoryDialog={() =>
                  setIsRenameEntryDialogOpened(true)
                }
              />
            </>
          )}
        </div>
        <div
          style={{
            height: props.windowHeight,
            flex: '1 1 auto',
            width: '100%'
          }}
        >
          <LoadingAnimation />
          {renderPerspective()}
          {isRenameEntryDialogOpened && (
            <RenameEntryDialog
              open={isRenameEntryDialogOpened}
              currentDirectoryPath={props.currentDirectoryPath}
              onClose={() => setIsRenameEntryDialogOpened(false)}
            />
          )}
        </div>
      </div>
      {props.isDesktopMode && !showWelcomePanel && (
        <ToggleButtonGroup
          value={currentPerspective}
          size="small"
          aria-label="change perspective"
          exclusive
          style={{
            bottom: 65,
            right: 15,
            zIndex: 1000,
            opacity: 0.9,
            position: 'absolute',
            backgroundColor: theme.palette.background.default
          }}
        >
          {perspectiveToggleButtons}
        </ToggleButtonGroup>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    selectedEntries: getSelectedEntries(state),
    directoryContent: getDirectoryContent(state),
    currentDirectoryFiles: getCurrentDirectoryFiles(state),
    currentDirectoryDirs: getCurrentDirectoryDirs(state),
    currentDirectoryPerspective: getCurrentDirectoryPerspective(state),
    searchResultCount: getSearchResultCount(state),
    currentLocationPath: getCurrentLocationPath(state),
    maxSearchResults: getMaxSearchResults(state),
    isDesktopMode: getDesktopMode(state),
    isReadOnlyMode: isReadOnlyMode(state),
    language: getCurrentLanguage(state),
    progress: getProgress(state),
    searchQuery: getSearchQuery(state),
    // keyBindings: getKeyBindingObject(state),
    defaultPerspective: getDefaultPerspective(state)
  };
}

function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(
    {
      toggleUploadDialog: AppActions.toggleUploadDialog,
      addTags: TaggingActions.addTags,
      removeTags: TaggingActions.removeTags,
      removeAllTags: TaggingActions.removeAllTags,
      editTagForEntry: TaggingActions.editTagForEntry,
      renameFile: AppActions.renameFile,
      openDirectory: AppActions.openDirectory,
      showInFileManager: AppActions.showInFileManager,
      openFsEntry: AppActions.openFsEntry,
      reflectCreateEntry: AppActions.reflectCreateEntry,
      loadDirectoryContent: AppActions.loadDirectoryContent,
      loadParentDirectoryContent: AppActions.loadParentDirectoryContent,
      setSelectedEntries: AppActions.setSelectedEntries,
      showNotification: AppActions.showNotification,
      setCurrentDirectoryPerspective: AppActions.setCurrentDirectoryPerspective,
      updateCurrentDirEntry: AppActions.updateCurrentDirEntry,
      setCurrentDirectoryColor: AppActions.setCurrentDirectoryColor,
      setSearchQuery: LocationIndexActions.setSearchQuery,
      openCurrentDirectory: AppActions.openCurrentDirectory,
      openURLExternally: AppActions.openURLExternally
    },
    dispatch
  );
}

const areEqual = (prevProp: Props, nextProp: Props) =>
  // nextProp.rightPanelWidth === prevProp.rightPanelWidth &&
  nextProp.settings.currentTheme === prevProp.settings.currentTheme &&
  nextProp.drawerOpened === prevProp.drawerOpened &&
  nextProp.isDesktopMode === prevProp.isDesktopMode &&
  nextProp.currentDirectoryPath === prevProp.currentDirectoryPath &&
  nextProp.currentDirectoryPerspective ===
    prevProp.currentDirectoryPerspective &&
  /* this props is set before currentDirectoryEntries is loaded and will reload FolderContainer */
  /* nextProp.currentLocationPath === prevProp.currentLocationPath &&  */

  JSON.stringify(nextProp.directoryContent) ===
    JSON.stringify(prevProp.directoryContent) &&
  JSON.stringify(nextProp.openedFiles) ===
    JSON.stringify(prevProp.openedFiles) &&
  JSON.stringify(nextProp.theme) === JSON.stringify(prevProp.theme) &&
  nextProp.windowWidth === prevProp.windowWidth &&
  nextProp.windowHeight === prevProp.windowHeight &&
  nextProp.language === prevProp.language &&
  nextProp.windowHeight === prevProp.windowHeight &&
  nextProp.searchQuery === prevProp.searchQuery;

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(
  // @ts-ignore
  React.memo(
    withStyles(undefined, { withTheme: true })(FolderContainer),
    areEqual
  )
);
