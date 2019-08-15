import Vue from 'vue'
import moment from 'moment'

Vue.filter("formatDate", function(val, type) {
    let formatType = type ? type : "YYYY-MM-DD HH:mm:ss"
    if (!val)return "";
    let i = parseInt(val);
    if (isNaN(i))return "";
    return moment(i).format(formatType);   
})
