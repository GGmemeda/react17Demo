import axios from 'axios';
const api='http://localhost:3004/comments'
export function getTableData(params, formData) {
    return axios.get(api, {
        params: {
            ...params,
            name:formData.name||undefined
        }
    }).then(res =>{
       return {
           total: res.data.length,
           list: res.data,
       }
    })
}

export function getProjectsById(id) {
    return axios.get(`${api}/${id}`);
}

export function addProjects(data, id) {
    if (id) {
        return axios.put(`${api}/${id}`, data);
    }
    return axios.post(api, data);
}

export function deleteProjects(id) {
    return axios.delete(`${api}/${id}`);
}