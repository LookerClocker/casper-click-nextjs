const checkStatus = response => {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 600
  ) {
    return response;
  } else {
    console.log("error");
  }
};

const parseJSON = async function (response) {
  const contentType = response?.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return { data: await response.json(), response };
    } else if (contentType.includes("text/html")) {
      return { data: await response.text(), response };
    } else {
      return { data: response, response };
    }
  } catch (error) {
    if ((error as any).name === "AbortError") {
      return { data: response, response };
    }

    (error as any).response = response;
    console.log(error);
  }
};

const parseHeaders = async function (response) {
  const contentRange = response?.headers.get("content-range") || "";
  try {
    if (contentRange) {
      return { contentRange };
    }
  } catch (error) {
    if ((error as any).name === "AbortError") {
      return { data: response, response };
    }

    (error as any).response = response;
    console.log(error);
  }
};

const checkResponse = ({ data, response }) => {
  if (response.status === 200) {
    return data;
  } else if (response.status === 600) {
    const code = Number(data?.code);
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(data.message);
    error.response = data;
    throw error;
  }
};

const getReponseHeaders = data => {
  return data;
};

export const fetchResponseHeaders = (url, opts = {}) => {
  return fetch(url, opts)
    .then(checkStatus)
    .then(parseHeaders)
    .then(getReponseHeaders)
    .catch(error => {
      if (error.name === "TypeError") {
        console.log(error);
      }
      throw error;
    });
};

const fetchData = (url, opts = {}) => {
  return fetch(url, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResponse)
    .catch(error => {
      if (error.name === "TypeError") {
        console.log(error);
      }
      throw error;
    });
};

export default fetchData;
