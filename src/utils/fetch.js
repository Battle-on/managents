import request from '@/utils/request'
import Vue from 'vue'

const vue = new Vue()

export default function fetchSmart(url, data, method = 'post') {

    const form = {
        url,
        method,
    }
    if (method === 'get') {
        form.params = data
    } else {
        form.data = data
    }

    return new Promise((resolve, reject)=>{
        request(form).then((res) => {
            resolve(res)
        }).catch((err)=>{
            vue.$message.error(err.msg)
            resolve(err)
        })
    })

}