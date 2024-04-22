import { useAlert } from 'react-alert';

// ----------------------------------------------------------------------

export default function useStockloanAlert() {
  const reactAlert = useAlert();

  return {
    basicAlert: (msg: string) => reactAlert.show(msg),
    successAlert: (msg: string) => reactAlert.success(msg),
    errorAlert: (msg: string) => reactAlert.error(msg),
  };
}
