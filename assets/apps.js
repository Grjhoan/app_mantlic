  const client = ZAFClient.init();
  //vars
  let crole=[], items=[], items2=[], newq=[], itemsgroup=[], itemsgroup2=[], objectnewgroups=[], settings=[], settings2=[], items3=[], items4=[], indicesni=[], indicespy=[], indicesmic=[], indicessv=[], indicespa=[], newq2=[], indicescr=[], indicesgt=[], indicesco=[], indicesbo=[], indiceshn=[], idx=[], idxmic=[], idx1pa=[], totals=[];
  let mailusers, size2, objectnew, size, sizeg, api_url, countc_mic=0, countni_ch=0, counthn1_ch=0, countbo_ch=0, countpy1_ch=0, countco1_ch=0, countsv1_ch=0, countgt1_ch=0, countcr1_ch=0, countpa1_ch=0;

  $(document).ready(function(){
    $("#capatable").hide();
    //listar agentes y admins endpoint
    settings = {
      url: '/api/v2/users.json?role[]=admin&role[]=agent',
      type: 'GET'
    };
     //listar grupos endpoint
    settings2 = {
      url: '/api/v2/groups.json',
      type: 'GET'
    };
    //detalle por agente
    getAgents(0);
  });

//call agents
  function getAgents(opt_sel) {
      return client.request(settings).then((data) => {
        items.push(data);
        //recursividad
        while(data.next_page!=null){
          settings.url=data.next_page;
          return getAgents(opt_sel);
        }
        for(let i=0;i<items.length;i++){
          items2.push(items[i]);
          objectnew=Object.assign({},items2);
        }
        size = Object.keys(objectnew).length;
        for(let j=1; j<size;j++){
          //uniendo todo en 1 solo array
          objectnew[0].users=objectnew[0].users.concat(objectnew[j].users);
        }
        //recorriendo el array final de usuarios
        for(let y=0;y<objectnew[0].users.length;y++){
          objectnew[0].users[y].notes="";
          //transformando las fechas
          objectnew[0].users[y].last_login_at=timeConverter(objectnew[0].users[y].last_login_at);
          //mapeando el rol a su nombre
          if (objectnew[0].users[y].custom_role_id === 3139697) {
            objectnew[0].users[y].custom_role_id = "Asesor";
          }else if(objectnew[0].users[y].custom_role_id === 360000043547){
            objectnew[0].users[y].custom_role_id = "Asesor con organización";
          }else if(objectnew[0].users[y].custom_role_id === 24717388){
            objectnew[0].users[y].custom_role_id = "Sólo play";
          }else if(objectnew[0].users[y].custom_role_id === 16517548){
            objectnew[0].users[y].custom_role_id = "Help Center";
          }else if(objectnew[0].users[y].custom_role_id === 360003978413){
            objectnew[0].users[y].custom_role_id = "Lider";
          }else if(objectnew[0].users[y].custom_role_id === 3139687){
            objectnew[0].users[y].custom_role_id = "Supervisor";
          }else if(objectnew[0].users[y].custom_role_id === 3298947){
            objectnew[0].users[y].custom_role_id = "Exclusivo para chat";
          }else if(objectnew[0].users[y].custom_role_id === 3348528){
            objectnew[0].users[y].custom_role_id = "Agent light";
          }else if(objectnew[0].users[y].custom_role_id === 360009438513){
            objectnew[0].users[y].custom_role_id = "Asesor (Interno)";
          }else if(objectnew[0].users[y].custom_role_id === null){
            objectnew[0].users[y].custom_role_id = "Administrador";
          }
        }
        //mapeo de grupos
        callGroupApi(objectnew[0].users);
        //llamada a la API de chat para traerse el last login de ese módulo
        callChatApi(objectnew);
        //print table
        setTimeout(() => {
          $("#loader").hide();
          $("#capatable").show();
          var table = $('#example0').dataTable(
            {
            "data": objectnew[0].users,
                "columns": [
                    {"data":"details"},
                    {"data":"name" },
                    {"data":"email"},
                    {"data":"custom_role_id"},
                    {"data":"default_group_id"},
                    {"data":"last_login_at"},
                    {"data":"notes"}
                ],
                "dom": 'Bfrtip',
                "buttons": [{
                "extend": 'csv',
                "filename": 'ExportCSV',
                "text": 'Exportar CSV',
                }]
        },{
          "bJQueryUI": true,
          "bStateSave": true
        }).yadcf([
          {
            column_number: 3,
            filter_type: "multi_select",
            select_type: 'select2',
            filter_default_label: "---",
            select_type_options: {
              width: '150px',
              allowClear: false
            }
          },
          {
            column_number: 0,
            filter_type: "multi_select",
            select_type: 'select2',
            filter_default_label: "---",
            select_type_options: {
              width: '80px',
              allowClear: false
            }
          },
          {
            column_number: 4,
            filter_type: "multi_select",
            select_type: 'select2',
            filter_default_label: "---",
            select_type_options: {
              width: '190px',
              allowClear: false
            }
          }
        ]);
        }, 4000);
    });
}

//formateando la fecha
function timeConverter(UNIX_timestamp){
  let a = new Date(UNIX_timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  // asignar la fecha en milisegundos
  var daten = new Date(time);
  var fecha = new Date();
  var fecha1 = moment(daten);
  var fecha2 = moment(fecha);
  let diat=fecha2.diff(fecha1, 'days');
  let totald;
  //definidiendo los intervalos de días sin log-in
  if(diat == 0 || diat == 1){
    totald="Menos de 1 día";
  }else if(diat > 1 && diat < 30){
    totald=diat + " días";
  }else if(diat >= 30 && diat < 60){
    totald="1 mes";
  }else if(diat >= 60 && diat < 90){
    totald="2 meses";
  }else if(diat >= 90 && diat < 120){
    totald="3 meses";
  }else if(diat >= 120 && diat < 150){
    totald="4 meses";
  }else if(diat >= 150 && diat < 180){
    totald="5 meses";
  }else if(diat >= 180 && diat < 210){
    totald="6 meses";
  }else if(diat >= 210 && diat < 240){
    totald="7 meses";
  }else if(diat >= 240 && diat < 270){
    totald="8 meses";
  }else if(diat >= 270 && diat < 300){
    totald="9 meses";
  }else if(diat >= 300 && diat < 330){
    totald="10 meses";
  }else if(diat >= 330 && diat < 365){
    totald="11 meses";
  }else if(diat >= 365){
    totald="Más de 1 año";
  }
  return totald;
}
//para cuando se guarde el token de Chat. (opcional para desarrollo)
function getToken() {
  return client.metadata().then(function (data) {
    return data.settings.token;
  })
};
//call chat api
 async function callChatApi(data){
  var token_access = "";
  var settings = {
    "async": true,
    "url": "https://www.zopim.com/api/v2/agents",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer " + token_access
    }
  }
  client.request(settings).then(function(response){
    data[0].users.sort();
    response.sort();
    for(var i=0; i<data[0].users.length; i++){
      for(var a=0; a<response.length; a++){
        if(data[0].users[i].email===response[a].email){
          //add last log-in chat
          response[a].last_login=timeConverter(response[a].last_login);
          data[0].users[i].notes = response[a].last_login;
        }
      }
    }
    //establecer el país de los agentes
    getNI(data, response);
    getPY(data, response);
    getBO(data, response);
    getSV(data, response);
    getCO(data, response);
    getHN(data, response);
    getCR(data, response);
    getGT(data, response);
    getPA(data, response);
    getMIC(data, response);
    return data;
  });

}

function getMIC(mailusers, muserschat){
  //millicom operation
  for(let y=0;y<mailusers[0].users.length;y++){
      for(var f=0;f<muserschat.length;f++){
        idxmic=mailusers[0].users[y].tags.indexOf('operacion_mic');
        if(idxmic != -1){
          if(mailusers[0].users[y].email===muserschat[f].email){
            countc_mic=countc_mic+1;
          }
          mailusers[0].users[y].details="MIC";
        }
      }
   
      while(idxmic != -1 && mailusers[0].users[y].custom_role_id!="Agent light"){
        indicesmic.push(idxmic);  
        idxmic = mailusers[0].users[y].tags.indexOf('operacion_mic', idxmic + 1);
      }
      
    }
  $("#count_mic_c").html(countc_mic);
  $("#count_mic").html(indicesmic.length);
}

function getNI(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_ni');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countni_ch=countni_ch+1;
        }
        mailusers[0].users[y].details="NI";
      }
    }
 
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light"){
      indicesni.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_ni', idx + 1);
    }
  }
  $('#count_n_c').html(countni_ch);
  $('#count_n').html(indicesni.length);
}

function getPY(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_py');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countpy1_ch=countpy1_ch+1;
        }
        mailusers[0].users[y].details="PY";
      }
    }
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicespy.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_py', idx + 1);
    }
  }
 
  $("#count_p_c").html(countpy1_ch);
  $("#count_p").html(indicespy.length);
}

function getBO(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_bo');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countbo_ch=countbo_ch+1;
        }
        mailusers[0].users[y].details="BO";
      }
    }
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicesbo.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_bo', idx + 1);
    }
  }
  $("#count_b_c").html(countbo_ch);
  $("#count_b").html(indicesbo.length);
}

function getSV(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_sv');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countsv1_ch=countsv1_ch+1;
        }
        mailusers[0].users[y].details="SV";
      }
    }
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicessv.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_sv', idx + 1);
    }
  }
  $('#count_s_c').html(countsv1_ch);
  $('#count_s').html(indicessv.length);
}

function getCO(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_co');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countco1_ch=countco1_ch+1;
        }
        mailusers[0].users[y].details="CO";
      }
    }
    
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicesco.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_co', idx + 1);
    }
  }
  $("#count_c_c").html(countco1_ch);
  $("#count_c").html(indicesco.length);
}

function getHN(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_hn');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          counthn1_ch=counthn1_ch+1;
        }
        mailusers[0].users[y].details="HN";
      } 
    }
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indiceshn.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_hn', idx + 1);
    }
  }
  $("#count_hn_c").html(counthn1_ch);
  $("#count_hn").html(indiceshn.length);
}

function getCR(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_cr');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countcr1_ch=countcr1_ch+1;
        }
        mailusers[0].users[y].details="CR";
      }
    }
    
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicescr.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_cr', idx + 1);
    }
  }
  $("#count_cr_c").html(countcr1_ch);
  $("#count_cr").html(indicescr.length);
}

function getGT(mailusers, muserschat){
  for(let y=0;y<mailusers[0].users.length;y++){
    for(var f=0;f<muserschat.length;f++){
      idx=mailusers[0].users[y].tags.indexOf('operacion_gt');
      if(idx != -1){
        if(mailusers[0].users[y].email===muserschat[f].email){
          countgt1_ch=countgt1_ch+1;
        }
        mailusers[0].users[y].details="GT";
      }
    }
    
    while(idx != -1 && mailusers[0].users[y].custom_role_id!="Agent light" && mailusers[0].users[y].custom_role_id!=2){
      indicesgt.push(idx);
      idx = mailusers[0].users[y].tags.indexOf('operacion_gt', idx + 1);
    }
  }
  $("#count_g_c").html(countgt1_ch);
  $("#count_g").html(indicesgt.length);
}

function getPA(mailusers, muserschat){
  for(let z=0;z<mailusers[0].users.length;z++){
    for(var f=0;f<muserschat.length;f++){
      idx1pa=mailusers[0].users[z].tags.indexOf('operacion_pa');
      if(idx1pa != -1){
        if(mailusers[0].users[z].email===muserschat[f].email){
          countpa1_ch=countpa1_ch+1;
        }
        mailusers[0].users[z].details="PA";
      }
    }
  
    while(idx1pa != -1 && mailusers[0].users[z].custom_role_id!="Agent light" && mailusers[0].users[z].custom_role_id!=2){
      indicespa.push(idx1pa);
      idx1pa = mailusers[0].users[z].tags.indexOf('operacion_pa', idx1pa + 1);
    }
  }
  $("#count_pa_c").html(countpa1_ch);
  $("#count_pa").html(indicespa.length);
}
//obtener last log-in chat
function callGroupApi(groupuser){
  client.request(settings2) .then(function(response){
    itemsgroup.push(response);
        while(response.next_page!=null){
          settings2.url=response.next_page;
          return callGroupApi(groupuser);
        }
        for(let i=0;i<itemsgroup.length;i++){
          itemsgroup2.push(itemsgroup[i]);
          objectnewgroups=Object.assign({},itemsgroup2);
        }
        sizeg = Object.keys(objectnewgroups).length;
        for(let j=1; j<sizeg;j++){
          objectnewgroups[0].groups=objectnewgroups[0].groups.concat(objectnewgroups[j].groups);
        }
        for(var i=0; i<groupuser.length; i++){
          for(var a=0; a<objectnewgroups[0].groups.length; a++){
            if(groupuser[i].default_group_id===objectnewgroups[0].groups[a].id){
              groupuser[i].default_group_id = objectnewgroups[0].groups[a].name;
            }
          }
        }
        return groupuser;
  });
}
