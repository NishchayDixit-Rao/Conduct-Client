let envs = [];
// let env = "testing";
let env = "development";

// const baseUrl = ''
// const baseMediaUrl = ''
envs["production"] = {
  mode: "production",
  baseApiUrl: "https://conduct.raoinformationtechnology.com/api/",
  baseMediaUrl: "https://conduct.raoinformationtechnology.com/uploads/",
  isvisited: false,
  counter: 0,
  priorityList: [
    // { id: "1", value: 'low', colorCode: 'blue' },
    { id: "2", value: "medium", colorCode: "yellow" },
    { id: "3", value: "high", colorCode: "red" },
  ],
  statuslist: [
    { id: "1", value: "to do", colorCode: "primary" },
    // { id: "2", value: 'in progress', colorCode: 'info' },
    { id: "3", value: "testing", colorCode: "warning" },
    { id: "4", value: "complete", colorCode: "success" },
  ],
};
envs["development"] = {
  baseApiUrl: "http://localhost:3000/api/",
  mode: "development",
  // baseApiUrl: "http://192.168.1.120:3000/api/",
  // baseApiUrl: "http://15.206.70.237:3000/api/",
  // baseMediaUrl: "http://15.206.70.237/uploads/",
  // baseApiUrl: "http://localhost:3000/api/",
  baseMediaUrl: "http://localhost:4200/uploads/",
  isvisited: false,
  counter: 0,
  priorityList: [
    // { id: "1", value: 'low', colorCode: 'blue' },
    { id: "2", value: "medium", colorCode: "yellow" },
    { id: "3", value: "high", colorCode: "red" },
  ],
  statuslist: [
    { id: "1", value: "to do", colorCode: "primary" },
    // { id: "2", value: 'in progress', colorCode: 'info' },
    { id: "3", value: "testing", colorCode: "warning" },
    { id: "4", value: "complete", colorCode: "success" },
  ],
};

envs["testing"] = {
  mode: "testing",
  baseApiUrl: "https://conduct-staging.raoinformationtechnology.com/api/",
  baseMediaUrl: "https://conduct-staging.raoinformationtechnology.com/uploads/",
  isvisited: false,
  counter: 0,
  priorityList: [
    // { id: "1", value: 'low', colorCode: 'blue' },
    { id: "2", value: "medium", colorCode: "yellow" },
    { id: "3", value: "high", colorCode: "red" },
  ],
  statuslist: [
    { id: "1", value: "to do", colorCode: "primary" },
    // { id: "2", value: 'in progress', colorCode: 'info' },
    { id: "3", value: "testing", colorCode: "warning" },
    { id: "4", value: "complete", colorCode: "success" },
  ],
};

export const config = envs[env];

// const baseMediaUrl = "http://localhost/PMT_Final(server)/uploads/";
// const baseMediaUrl = "http://192.168.1.54/PMT_Final(server)/uploads/"
// const baseMediaUrl = "http://conduct.raoinformationtechnology.com/server/uploads/";

// const baseUrl = "http://192.168.1.54:4001/api/";
// const baseUrl = "http://localhost:4001/api/"
// const baseUrl = "http://conduct.raoinformationtechnology.com:5001/api/";

// export const config = {
//     baseApiUrl: baseUrl,
//     baseMediaUrl: baseMediaUrl,
//     "priorityList": [
//         // { id: "1", value: 'low', colorCode: 'blue' },
//         { id: "2", value: 'medium', colorCode: 'yellow' },
//         { id: "3", value: 'high', colorCode: 'red' }
//     ],
//     "statuslist": [
//         { id: "1", value: 'to do', colorCode: 'primary' },
//         // { id: "2", value: 'in progress', colorCode: 'info' },
//         { id: "3", value: 'testing', colorCode: 'warning' },
//         { id: "4", value: 'complete', colorCode: 'success' }
//     ],
// }
