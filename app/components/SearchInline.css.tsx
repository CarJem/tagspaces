import AppConfig from '@tagspaces/tagspaces-platforms/AppConfig';
import { BaseCSSProperties } from '@mui/styles';

export interface StyleProps {
  panel: BaseCSSProperties;
  fontIcon: BaseCSSProperties;
  header: BaseCSSProperties;
  icon: BaseCSSProperties;
  locationListArea: BaseCSSProperties;
  searchArea: BaseCSSProperties;
  topShadow: BaseCSSProperties;
  listItem: BaseCSSProperties;
  listItemSelected: BaseCSSProperties;
  panelTitle: BaseCSSProperties;
  nested: BaseCSSProperties;
  listItemTitleText: BaseCSSProperties;
  hiddenFileInput: BaseCSSProperties;
  toolbar: BaseCSSProperties;
  formControl: BaseCSSProperties;
  mainActionButton: BaseCSSProperties;
  leftIcon: BaseCSSProperties;
}

export const styles = (theme: any) => {
  const baseStyle: StyleProps = {
    panel: {
      height: '100%',
      paddingLeft: 5,
      paddingRight: 5
    },
    fontIcon: {
      color: theme.palette.text.primary
    },
    header: {
      color: theme.palette.text.primary
    },
    icon: {
      margin: theme.spacing(1)
    },
    locationListArea: {
      paddingTop: 0,
      marginTop: 0
      // @ts-ignore
      // overflowY: AppConfig.isFirefox ? 'auto' : 'overlay'
    },
    searchArea: {
      paddingTop: 0,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 0,
      height: 'calc(100% - 50px)',
      maxHeight: 'calc(100% - 50px)',
      overflowX: 'hidden',
      // @ts-ignore
      overflowY: AppConfig.isFirefox ? 'auto' : 'overlay'
    },
    topShadow: {
      borderTop: '1px solid lightgray',
      height: 10,
      boxShadow: '0px -7px 20px 0px rgba(255, 255, 255, 1)'
    },
    listItem: {
      paddingLeft: 0,
      paddingTop: 2,
      paddingBottom: 2,
      paddingRight: 0,
      borderRadius: 5,
      backgroundColor: 'transparent'
    },
    listItemSelected: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 5,
      backgroundColor: theme.palette.primary.light
    },
    panelTitle: {
      textTransform: 'uppercase',
      flex: 1,
      paddingLeft: 7,
      paddingTop: 12
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    listItemTitleText: {
      fontWeight: 'bold'
    },
    hiddenFileInput: {
      display: 'none'
    },
    toolbar: {
      display: 'flex'
    },
    formControl: {
      width: '100%',
      marginBottom: 10
    },
    mainActionButton: {
      marginTop: 10,
      marginLeft: 0,
      paddingLeft: 8
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    }
  };
  return baseStyle as any;
};
