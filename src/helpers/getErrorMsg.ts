export const getErrorMsg = (
  tmpMsg: string,
  cName: string,
  arg: string
): string => {
  return tmpMsg.replace("{#fieldName}", cName).replace("{#arg}", arg);
};
