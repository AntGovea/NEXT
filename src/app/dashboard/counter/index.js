const express = require("express");
const api = express();
const server = require("http").createServer(api);
const fs = require("fs").promises;
const axios = require("axios");
const Buffer = require("buffer").Buffer;
const querystring = require("querystring");
const socket = require("socket.io-client")("ws://visitapp.io:4013", {
  transports: ["websocket"],
});

const port = 8080;
const interval = 5000;
const {
  apiServer,
  authToken,
  tenant,
  syncToken,
  residentLevel,
  employeeLevel,
  visitorLevel,
  airbnbLevel,
} = require(`${__dirname}/prod_configuration.json`);

let headers = { Authorization: `Security: ${authToken}; Channel: ${tenant}` };
const source = axios.CancelToken.source();
function cancelRequestAxios() {
  source.cancel("Request canceled due to an error.");
}

async function handleDocumentActions(action, path, data) {
  try {
    let validation = false;
    let dataReturned = [];
    let description = "";

    if (action === "create") {
      try {
        await fs.writeFile(path, JSON.stringify(data), "utf8");
        validation = true;
        description = "file created successfully";
      } catch (error) {
        console.log(error);
      }
    }
    if (action === "read") {
      try {
        let data = await fs.readFile(path, "utf8");
        data = data;
        validation = true;
        description = "file readed successfully";
      } catch (error) {
        console.log(error);
      }
    }
    if (action === "update") {
      try {
        await fs.writeFile(path, JSON.stringify(data), "utf8");
        validation = true;
        description = "file updated successfully";
      } catch (error) {
        console.log(error);
      }
    }
    return {
      valid: validation,
      data: dataReturned,
      description,
    };
  } catch (error) {
    console.log(error);
  }
}
class ZKEvents {
  constructor() {
    this.username = null;
    this.password = null;
    this.base_url = null;
    this.cookie = null;
    this.hostname = null;
    this.port = null;
    this.currentUrl = null;
  }

  async login(username = "", password = "", hostname = "", port = "8098") {
    try {
      const baseUrl = `http://${hostname}:${port}`;
      const loginUrl = `${baseUrl}/login.do`;

      let response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const setCookie = response.headers["set-cookie"];
      let sessionCookie = "";
      if (setCookie) {
        sessionCookie =
          setCookie.find((cookie) => cookie.includes("SESSION")) || "";
        sessionCookie = sessionCookie.split(";")[0];
      }

      const data = querystring.stringify({
        loginType: "NORMAL",
        username,
        password: require("crypto")
          .createHash("md5")
          .update(password)
          .digest("hex"),
        checkCode: "",
      });

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": data.length,
      };

      if (sessionCookie) {
        headers["Cookie"] = sessionCookie;
      }

      response = await axios.post(loginUrl, data, { headers, timeout: 30000 });

      const responseData = response.data;
      const ret = responseData["ret"];
      let sessionId = "";

      const responseCookies = response.headers["set-cookie"];
      if (responseCookies) {
        sessionId =
          responseCookies.find((cookie) => cookie.includes("SESSION")) || "";
        sessionId = sessionId.split(";")[0];
      }

      if (ret === "ok" && sessionId) {
        this.cookie = sessionId;
        console.log("cookie" + this.cookie);
        return true;
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      cancelRequestAxios();
      return null;
    }
  }

  async getEvent() {
    try {
      // Define la URL para la solicitud
      const url = `${this.base_url}/transaction/list?pageNo=1&pageSize=5`;
      // Define los encabezados de la solicitud
      const headers = {
        Accept: "application/json",
        Cookie: `${this.cookie}`,
      };

      const timeout = 5000;
      // Realiza la solicitud HTTP
      const response = await axios({
        method: "get",
        url,
        headers,
        timeout,
      });
      // Extrae el cuerpo de la respuesta
      const { code, menssage, data: arrayData } = response.data;
      // Verifica el código de estado y procesa la respuesta
      if (code === 0) {
        // Retorna los datos de la respuesta
        return arrayData;
      } else {
        // Registra un error si no se recibe un código de estado esperado
        console.error("ERROR ZKINBIO");
        return null;
      }
    } catch (error) {
      // Registra cualquier error que ocurra durante la solicitud
      console.error("Error al obtener eventos:", error);
      cancelRequestAxios();
      return null;
    }
  }
  async getPersonData(pin) {
    try {
      const headers = {
        Accept: "application/json",
        Cookie: `${this.cookie}`,
      };

      const url = `${this.base_url}/person/get/${pin}`;
      const {
        data: { code, message, data: dataPerson },
      } = await axios({
        method: "get",
        url,
        headers,
      });
      if (code !== 0) {
        return null;
      }
      return dataPerson;
    } catch (error) {
      console.log("error getPersonData", error);
      return null;
    }
  }
  async addPerson(personData) {
    try {
      console.log("------------------------------");
      console.log("agregando persona con body");
      // console.log(personData)

      const url = `${this.base_url}/person/add`;

      console.log("------------------------------");
      const headers = {
        Accept: " application/json",
        "Content-Type": " application/json",
        Cookie: this.cookie,
      };

      const { data } = await axios({
        method: "post",
        url,
        data: personData,
        headers,
      });

      console.log("data de addPerson");
      console.log(data);

      if (data.code === 0) {
        return {
          status: 0,
          data: data.data,
        };
      } else {
        return {
          status: data.code,
          data: data.data,
        };
      }
    } catch (error) {
      console.log("error en addPerson()", error);
      cancelRequestAxios();
      return {
        status: null,
        data: null,
      };
    }
  }

  async getBase64(url) {
    try {
      const { data } = await axios.get(`${url}`, {
        responseType: "arraybuffer",
      });
      if (data === null || data === undefined) {
        console.log("error al obtener la imagen de amazon");
        return;
      }
      let base64Image = Buffer.from(data, "binary").toString("base64");
      return base64Image;
    } catch (error) {
      console.error("error syncPerson", error.message);
    }
  }

  async syncPerson({ id, userId, kind, name, house, url, level }) {
    try {
      console.log(`\n`);
      console.log("------------evento recivido----------------");
      console.log("parametros");
      console.log("userId", userId);
      console.log("kind", kind);
      console.log("name", name);
      console.log("house", house);
      console.log("level", level);
      console.log("urlImageUser", url);

      console.log(`\n`);

      let base64Image = await this.getBase64(url);

      let pinBase = 4000;
      switch (kind) {
        case "resident":
          pinBase = 2000;
          break;
        case "employee":
          pinBase = 4000;
          break;
        case "visitor":
          pinBase = 8000;
          break;
        case "airbnb":
          pinBase = 10000;
          break;
        case "amenity":
          pinBase = 14000;
        default:
          pinBase = 4000;
      }
      let pin = pinBase + userId;
      let userValues = {
        accLevelIds: level,
        depCode: 1,
        name: name,
        lastName: kind + "," + house,
        personPhoto: base64Image,
        vislightPhoto: base64Image,
        accStartTime: "2022-01-01 00:00:00",
        accEndTime: "2024-12-30 23:59:59",
        pin: pin,
      };
      const personResult = await this.editPerson(userValues, pin);
      let personData = {};
      // console.log()
      if (personResult === null) {
        // console.log("asignando userValues a personData")
        personData = userValues;
      } else {
        // console.log("asignando personResult y userValues a personData")
        personData = { ...personResult, ...userValues };
      }
      //* Agregando persona
      const resp = await this.addPerson(personData);
      if (resp.status === -63 || resp.status === 63) {
        let newElement = {
          name: "Error",
          lastName: " no se detecta un rostro",
          accLevelIds: userValues.name,
        };
        console.log("No se pudo detectar un rostro en la fotografia");
        // setOrderList(dataEvents, newElement);
        this.sendUpdateToVisitapp(id);
        return;
      }

      if (resp.status === 0) {
        // setOrderList(dataEvents, personData);
        // console.log("sincronzacion completa...");
        return null;
      } else {
        // console.log("sincronizacion con estatus...");
        console.log("resp", resp);
      }
    } catch (error) {
      console.log("\n");
      console.log("error al sincronizar datos....", error);
      console.log("\n");
      cancelRequestAxios();
    }
  }
  async editPerson(data = null, pin = null) {
    try {
      if (data !== null && pin !== null) {
        const dataPerson = await this.getPersonData(pin);

        return dataPerson;
      }
    } catch (error) {
      console.error("handleEditPerson", error);
      cancelRequestAxios();
    }
  }

  async sendUpdateToVisitapp(id) {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Security: 2159639hhstigoex6y4akiejdr1g5g8b2jh43lum8awzz8alj1hh4lhcphmlqo13s0rqbst7bsj6emqxqd0toa5ra60lmcbq; Channel: ${tenant}`,
      };
      console.log(`headers`, headers);
      console.log(
        `${apiServer}/api/v2-7-0?query=mutation{residentUpdateFacialStatus(id:${id}){message}}`
      );

      const response = await axios({
        url: `${apiServer}/api/v2-7-0?query=mutation{residentUpdateFacialStatus(id:${id}){message}}`,
        method: "post",
        data: {},
        headers,
      });
      // console.log("------ Send change of status to Visitapp---------");
      console.log("response.data de visitapp", response.data);
    } catch (error) {
      console.log("sendNotificationVisitApp" + error);
      cancelRequestAxios();
    }
  }

  async processEvents(events) {
    try {
      for (let event of events) {
        //* Datos del evento a comparar con el ultimo registro del .txt
        const pin = event.pin;
        const id = event.id;
        const mode = event.verifyModeName;
        const eventTime = event.eventTime;
        const filePath = `${__dirname}/last_event.json`;
        const reg = /.*salida.*/gi;
        let filePathLogs = `${__dirname}/event-lost.json`;
        let data;

        try {
          try {
            // data =await handleDocumentActions("read",filePath,"")
            data = await fs.readFile(filePath, "utf8");
          } catch (error) {
            console.log("error al leer " + filePath);
            // await handleDocumentActions("")
            await fs.writeFile(filePath, "");
            return;
          }

          // si el archivo esta vacio
          if (data === "") {
            console.log("json vacio");
            await fs.writeFile(filePath, JSON.stringify(id + "," + eventTime));
            data = "";
            return;
          }

          //en caso de contar con informacion
          data = await fs.readFile(filePath, "utf8");
          console.log("dataLastEvnt", data);
          console.log("mode", mode);
          const lastEvent = data.split(",");
          const eventDate = new Date(eventTime);
          let dateStringFormated = lastEvent[1].replace(" ", "T");
          dateStringFormated = dateStringFormated.replace('"', "");
          const lastEventDate = new Date(dateStringFormated);
          const reader = event.devName;
          if (eventDate > lastEventDate && mode == "Face") {
            const lastName = event.lastName.split(",");
            const kind = lastName[0];
            const house = lastName[1];
            let userId = parseInt(pin);
            const door = event.doorName;

            console.log("kind", kind);
            console.log("lastName", lastName);

            console.log("house", house);
            console.log("userId", userId);
            console.log("door", door);

            switch (kind) {
              case "resident":
                userId = parseInt(pin) - 2000;
                break;
              case "employee":
                userId = parseInt(pin) - 4000;
                break;
              case "visitor":
                userId = parseInt(pin) - 8000;
                break;
              case "airbnb":
                userId = parseInt(pin) - 10000;
                break;
              case "amenity":
                userId = parseInt(pin) - 14000;
                break;
            }

            if (house && house !== "undefined" && house !== undefined) {
              if (reader.match(reg)) {
                if (house === undefined) {
                  return;
                }
                console.log("evento mandado a visitapp");
                console.log();
                if (kind == "employee" || kind == "resident") {
                  console.log(
                    `${apiServer}/api/v2-7-0?query=mutation{facialLeaveVisit(kind:"${kind}",house:"${house}",userId:${userId},door:"${door}"){id}}`
                  );
                }
                try {
                  const { data } = await axios.post(
                    `${apiServer}/api/v2-7-0?query=mutation{facialLeaveVisit(kind:"${kind}",house:"${house}",userId:${userId},door:"${door}"){id}}`,
                    {},
                    { headers }
                  );
                  console.log("dataX", data);
                  if (data.data.facialAccessVisit.id) {
                    console.log(
                      "++++++++++++++++++Registro Exitoso++++++++++++++++++++++"
                    );
                    await fs.writeFile(filePath, id + "," + eventTime, "utf8");
                  } else {
                    console.log(data);
                  }
                } catch (error) {
                  console.log(error);
                }
              } else {
                if (kind == "employee") {
                  console.log(
                    `${apiServer}/api/v2-7-0?query=mutation{facialAccessVisit(kind:"${kind}",house:"${house}",userId:${userId},door:"${door}"){id}}`
                  );
                }
                try {
                  const { data } = await axios.post(
                    `${apiServer}/api/v2-7-0?query=mutation{facialAccessVisit(kind:"${kind}",house:"${house}",userId:${userId},door:"${door}"){id}}`,
                    {},
                    { headers: headers }
                  );
                  console.log("- Request to notification.");
                  console.log(data);
                  if (data.data.facialAccessVisit.id) {
                    console.log(
                      "++++++++++++++++++Registro Exitoso++++++++++++++++++++++"
                    );
                    await fs.writeFile(filePath, id + "," + eventTime, "utf8");
                  } else {
                    console.log(data);
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            } else {
              let oldEvents = "";
              filePathLogs = `${__dirname}/event-lost.json`;
              try {
                data = await fs.readFile(filePathLogs, "utf8");
                if (data) {
                  oldEvents = JSON.parse(data);
                }
              } catch (error) {
                console.log(error);
                await fs.writeFile(
                  filePathLogs,
                  JSON.stringify([event.id]),
                  "utf8"
                );
                return;
              }
              await fs.writeFile(
                filePathLogs,
                JSON.stringify([...oldEvents, event.id]),
                "utf8"
              );
            }
          } else {
            let oldEvents = "";
            filePathLogs = `${__dirname}/event-lost.json`;
            try {
              data = await fs.readFile(filePathLogs, "utf8");
              if (data) {
                oldEvents = JSON.parse(data);
              }
            } catch (error) {
              console.log("error al leer lost-events");
              await fs.writeFile(
                filePathLogs,
                JSON.stringify([event.id]),
                "utf8"
              );
              return;
            }
            await fs.writeFile(
              filePathLogs,
              JSON.stringify([...oldEvents, event.id]),
              "utf8"
            );
          }
        } catch (error) {
          console.log(error);
          await fs.writeFile(filePathLogs, JSON.stringify([event.id]), "utf8");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deletePerson(pin, id) {
    try {
      console.log("eliminando usuario...\n");
      console.log("kind");
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: this.cookie,
      };
      const [response1, response2, response3] = await Promise.all([
        axios.get(`${this.base_url}/person/delete/${pin}`, {
          headers,
        }),
        axios.post(
          `${this.base_url}/person/delete/${pin}`,
          {},
          {
            headers,
          }
        ),
      ]);

      if (response2.data.code === 0) {
        console.log("registro eliminado correctamente");
        let newElement = {
          name: "eliminado",
          lastName: "pin",
          accLevelIds: pin,
        };
        // setOrderList(dataEvents, newElement);
      }
      // if (false) {
      await this.sendUpdateToVisitapp(id);

      // }
    } catch (error) {
      console.log("deletePerson =>", error);
      cancelRequestAxios();
    }
  }
}

let zkController = new ZKEvents();
let dataEvents = [];

api.get("/getEVents", (req, res) => {
  const memoryInfo = process.memoryUsage();
  console.log(`Memory usage: ${JSON.stringify(memoryInfo)}`);
  res.send({ dataEvents, memoryInfo });
});

server.listen(port, async () => {
  socket.on("connect", () => {
    console.log("socket connect" + socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  // socket que reacciona al sincronizar algun usuario desde
  socket.on(`${tenant}_facial_sync_${syncToken}`, function (data) {
    console.log("----Syncronizando de evento---- ");

    console.log("---parameter information---", data);

    const { id, userId, kind, name, house, url } = data;
    let level = "";
    switch (kind) {
      case "resident":
        level = residentLevel;
        break;
      case "employee":
        level = employeeLevel;
        break;
      case "visitor":
        level = visitorLevel;
        break;
      case "airbnb":
        level = airbnbLevel;
        break;
      case "amenity":
        level = amenityLevel;
        break;
      default:
        level = visitorLevel;
        break;
    }
    zkController.syncPerson({
      id,
      userId,
      kind,
      name,
      house,
      url,
      level,
    });
  });

  socket.on(`${tenant}_facial_delete_${syncToken}`, function (data) {
    console.log("----Eliminacion de usuario---");
    console.log("parameter information ", data);

    //si el cuarpo tiene la propiedad de suspender en true
    const { id, userId, kind } = data;
    console.log("kind", kind);
    console.log("userId", userId);

    let pin = 0;
    let pin_base = 4000;
    switch (kind) {
      case "resident":
        pin_base = 2000;
        break;
      case "employee":
        pin_base = 4000;
        break;
      case "visitor":
        pin_base = 8000;
        break;
      case "airbnb":
        pin_base = 10000;
        break;
      case "amenity":
        pin_base = 14000;
    }
    pin = pin_base + userId;
    console.log("pin", pin);
    zkController.deletePerson(pin, id);
  });
//   const sendStatusToVisitapp = async () => {
//     try {
//       let idResidencial = null;
//       const visitappLA = "http://visitapp.la:4322";

//       let url = `${visitappLA}/residenciales/getIdResidencialById`;
//       const resposeId = await axios.post(
//         `${visitappLA}/residenciales/getIdResidentialByTenant`,
//         {
//           tenant: tenant,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (resposeId.data) {
//         const resp = resposeId.data;
//         if (resp.data.length > 0) {
//           idResidencial = resp.data[0].id_residencial;
//         }
//       }

//       url = `${visitappLA}/residenciales/verifyResidential`;

//       // console.log('****************sendStatusToVisitapp*******************')
//       //   console.log('idResidencial,',idResidencial);
//       //   console.log('tenant,',tenant);
//       //   console.log('apiServer,',apiServer);
//       //   console.log('estatus',true);
//       let response = await axios.request({
//         url: url,
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: JSON.stringify({
//           idResidencial: idResidencial,
//           tenant: tenant,
//           apiServer: apiServer,
//           estatus: true,
//         }),
//       });
//       // console.log('************response***********************')
//       // console.log(response)
//       if (response.data) {
//         let responseUpdateStatus = response.data;
//         // console.log(responseUpdateStatus)
//         if (responseUpdateStatus.estatus) {
//           console.log("Online!");
//         } else {
//           console.log("OffLine!");
//           console.log(responseUpdateStatus);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

  try {
    console.log("*********Visitapp Facial Sync Server****************");
    console.log(`*********Running on port :${port}****************** `);

    const user = "admin";
    const password = "Suro2024";
    const ZkbioIp = "192.168.1.70";
    let events = null;

    // Inicia sesión en el sistema ZKInbio con un nombre de usuario, contraseña, hostname y puerto específicos.
    const success = await zkController.login(user, password, ZkbioIp);

    if (!success) {
      console.error("Inicio de sesión fallido");
      return;
    }
    console.log("inicio de sesion exitoso");
    setInterval(async () => {
      zkController.base_url = `http://${ZkbioIp}:8098/api`;
      zkController.port = "8098";
      zkController.hostname = ZkbioIp;

      events = await zkController.getEvent();
      console.log(events.length);
      if (events) {
        await zkController.processEvents(events);
      } else {
        console.error(events);
      }
    }, interval);

    // setInterval(async () => {
    //   await sendStatusToVisitapp();
    // }, 10000);
  } catch (error) {
    console.error("error", error);
    cancelRequestAxios();
  }
  /*  finally{
      console.log('liberacion de recursos')
    } */
});