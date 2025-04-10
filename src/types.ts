export type ISuccessResult<V> = {
  readonly type: 'success';
  readonly value: V;
};

export type IErrorResult = {
  readonly type: 'error';
  readonly error: string;
  readonly cause?: any;
};

export type IResult<V> = ISuccessResult<V> | IErrorResult;
export type IEmptyResult = IResult<undefined>;

export const isSuccessful = <V>(
  result: IResult<V>
): result is ISuccessResult<V> => {
  return result.type === 'success';
};

export const isError = <V>(result: IResult<V>): result is IErrorResult => {
  return result.type === 'error';
};

export const successResultOf = <V>(value: V): ISuccessResult<V> => {
  return {
    type: 'success',
    value,
  };
};

export const successResult = (): ISuccessResult<undefined> => {
  return {
    type: 'success',
    value: undefined,
  };
};

export const errorResultOf = (error: string, cause?: any): IErrorResult => {
  return {
    type: 'error',
    error,
    cause,
  };
};
