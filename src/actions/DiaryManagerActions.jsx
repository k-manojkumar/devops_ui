import {
  SEARCH_COLLEAGUE,
  ADD_EVENTS,
  ADD_RESOURCE,
  NO_COLLEAGUE,
  SERVICE_FAILURE
} from "./actionTypes";

//const baseURL = process.env.REACT_APP_GET_RESOURCE_URL;
/* process.env.NODE_ENV === "development"
    ? "http://10.179.210.253:7601/DiaryManagerService/v1/"
    : process.env.REACT_APP_GET_RESOURCE_URL; */
const baseURL = "http://myapp.kmk/DevOpsService/v1/";

export const searchColleague = collID => dispatch => {
  console.log("inside sortCodeActions --> searchColleague " + collID);
  var url = baseURL + "getResource?fileID=" + collID;
  return fetch(url, {
    crossDomain: true,
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("SUCCESSS");
        return res.json();
      } else if (res.status === 204) {
        throw res.status;
      }
      //return res.json();
    })
    .then(result => {
      console.log("searchColleague result -->" + result);

      dispatch(addColleague(result));
      //dispatch(getEvents(result));
    })
    .catch(err => {
      console.log(err);
      if (err === 204) {
        dispatch({
          type: NO_COLLEAGUE
        });
      } else {
        dispatch({
          type: SERVICE_FAILURE
        });
      }
    });
};

export const addColleague = resources => dispatch => {
  //let events = getEvents(details.id);
  console.log("addColleague Resources->" + resources);

  return dispatch({
    type: ADD_RESOURCE,
    payload: {
      resources: [resources],
      events: resources.events
    }
  });
};

const getEvents = result => dispatch => {
  var url = baseURL + "getEvents?fileID=" + result.id;
  return fetch(url, {
    crossDomain: true,
    method: "GET"
  })
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("SUCCESSS");
        return res.json();
      } else if (res.status === 204) {
        throw res.status;
      }
      throw res;
    })
    .then(result => {
      console.log("getEvents result ->" + result);

      dispatch(addEvents(result));
    })
    .catch(err => {
      console.log(err);
    });
};

export const addEvents = events => dispatch => {
  //let events = getEvents(details.id);
  console.log("addEvents events->" + events);

  return dispatch({
    type: ADD_EVENTS,
    payload: events
  });
};
