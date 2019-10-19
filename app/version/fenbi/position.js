const Promise = require('bluebird');
const poolFenbi = require(process.cwd()+'/app/database/db.example');
const request  = require('sync-request');
const redis = require('redis');
// 对redis中的方法做同步处理
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(6379, '127.0.0.1');
const Helper = require(process.cwd()+'/app/tool/helper');

module.exports = function (postData) {
    return client.lpopAsync('node_base_list').then(function (res) {
        console.log(res);
        return Helper.jsonSuccess(res);
    })
};

let a = 1;

var delay = function (millis) {
    return new Promise(function (resolve, reject) {
        setTimeout(function() {
            resolve();
        }, millis);
    });
};

var p = delay(10);

module.exports = function (postData) {
    return new Promise(function (resolve) {
        return client.lpopAsync('node_cate_list').then(function (base) {
            // console.log('base',base);
            resolve(base);
        });
    }).then(function (base) {
        let j = 0;
        for (let i = 0; i < 40068; ++i) {
            p = p.then(function() {
                console.log('hi');
                client.lpopAsync('node_pro_base').then(function (province) {
                    console.log('pro', province);
                    if (province) {
                        Promise.using(poolFenbi(), function (connection) {
                            // console.log('进入这里了吗');
                            let host = "https://market-api.fenbi.com/toolkit/api/v1/search/positionsByPersonInfo?";
                            let start = 0;
                            let end = 10;
                            let startParams = host + province + base + 'start=' + start + '&len=';
                            let url = startParams + end;
                            console.log(i + '+++请求的接口地址是:', url);
                            let params = parseQueryString(url);
                            url = encodeURI(url);
                            let ret = request('GET', url);
                            let result = JSON.parse(ret.getBody('utf8'));
                            let total = result.total;
                            console.log(i + '++初始总数', total);
                            if (total > 0) {
                                url = startParams + total;
                                // console.log('总数:', total);
                                url = encodeURI(url);
                                let ret = request('GET', url);
                                let result = JSON.parse(ret.getBody('utf8'));

                                let list = result.datas;
                                let fields = ['position_id', 'positionCode', 'department', 'subDepartment', 'positionName', 'employCount', 'interviewRatio', 'remark', 'verifyCount', 'competitionRatio', 'added', 'province', 'categoryCode', 'disciplineCode', 'majorCode', 'basicWorkExp', 'politicStatus', 'majorDegree', 'graduated', 'basicWorkYear'];
                                let sql = "insert into `positions` (??) values ";
                                let value = [fields];
                                for (let i in list) {
                                    sql += "(?),";
                                    value.push([
                                        list[i].id,
                                        list[i].positionCode,
                                        list[i].department,
                                        list[i].subDepartment,
                                        list[i].positionName,
                                        list[i].employCount,
                                        list[i].interviewRatio,
                                        list[i].remark,
                                        list[i].verifyCount,
                                        list[i].competitionRatio,
                                        list[i].added,
                                        params.province,
                                        params.categoryCode,
                                        params.disciplineCode ? params.disciplineCode : '',
                                        params.majorCode ? params.majorCode : '',
                                        params.basicWorkExp,
                                        params.politicStatus,
                                        params.majorDegree,
                                        params.graduated,
                                        params.basicWorkYear,
                                    ]);
                                }
                                sql = Helper.trim(sql, ',');
                                connection.query(sql, value).then(function (result) {
                                    console.log('插入数据的id', result.insertId);
                                })
                            }
                            // console.log('a的值', a);
                        });
                    }
                    return delay(50);
                });
            })
        }
        return Helper.jsonSuccess([], 'success');
        /*while (a > 0) {
                // j++;
                new Promise(resolve => {
                    client.lpopAsync('node_pro_base').then(function (res) {
                        console.log('pro', res);
                        resolve(res);
                    });
                }).then(function (province) {
                    console.log('省市', province);
                    if (province) {
                        Promise.using(poolFenbi(), function (connection) {
                            console.log('进入这里了吗');
                            let host = "https://market-api.fenbi.com/toolkit/api/v1/search/positionsByPersonInfo?";
                            let start = 0;
                            let end = 10;
                            let startParams = host + province + base + 'start=' + start + '&len=';
                            let url = startParams + end;
                            console.log('请求的接口地址是:', url);
                            let params = parseQueryString(url);
                            url = encodeURI(url);
                            let ret = request('GET', url);
                            let result = JSON.parse(ret.getBody('utf8'));
                            let total = result.total;
                            if (total > 0) {
                                url = startParams + total;
                                console.log('总数:', total);
                                url = encodeURI(url);
                                let ret = request('GET', url);
                                let result = JSON.parse(ret.getBody('utf8'));

                                let list = result.datas;
                                let fields = ['position_id', 'positionCode', 'department', 'subDepartment', 'positionName', 'employCount', 'interviewRatio', 'remark', 'verifyCount', 'competitionRatio', 'added', 'province', 'categoryCode', 'disciplineCode', 'majorCode', 'basicWorkExp', 'politicStatus', 'majorDegree', 'graduated', 'basicWorkYear'];
                                let sql = "insert into `positions` (??) values ";
                                let value = [fields];
                                for (let i in list) {
                                    sql += "(?),";
                                    value.push([
                                        list[i].id,
                                        list[i].positionCode,
                                        list[i].department,
                                        list[i].subDepartment,
                                        list[i].positionName,
                                        list[i].employCount,
                                        list[i].interviewRatio,
                                        list[i].remark,
                                        list[i].verifyCount,
                                        list[i].competitionRatio,
                                        list[i].added,
                                        params.province,
                                        params.categoryCode,
                                        params.disciplineCode ? params.disciplineCode : '',
                                        params.majorCode ? params.majorCode : '',
                                        params.basicWorkExp,
                                        params.politicStatus,
                                        params.majorDegree,
                                        params.graduated,
                                        params.basicWorkYear,
                                    ]);
                                }
                                sql = Helper.trim(sql, ',');
                                connection.query(sql, value).then(function (result) {
                                    console.log('插入数据的id', result.insertId);
                                })
                            }
                            console.log('a的值', a);
                        });
                    } else {
                        a = 0;
                        console.log('第三次a的值', a);
                    }
                })
        }*/
    });
};

function parseQueryString(url) {
    let params = {};
    let arr = url.split("?");
    let arr1 = arr[1].split("&");
    for (let i = 0; i < arr1.length; i++) {
        let arr2 = arr1[i].split('=');
        if (!arr2[1]) {
            params[arr2[0]] = 'true';
        } else if (params[arr2[0]]) {
            let arr3 = [params[arr2[0]]];
            arr3.push(arr2[1]); params[arr2[0]] = arr3;
        } else {
            params[arr2[0]] = decodeURI(arr2[1]);
        }
    }
    return params;
}
