type ErrToast = {
  cause: unknown | string;
  message: string;
  name: string;
  stack: string;
};

export async function getErrStatus(err: ErrToast) {
  return {
    statusText: err.cause,
    error: err.message,
  };
}

export async function getOkStatus(res) {
  return {
    statusText: res.request.statusText,
    data: res.data.data,
  };
}
