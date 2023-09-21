import db from "../DataBase/DB.js";

export const createUser = async (user) => {

    const answer = await db('users').insert(user)
    
    return answer
}

export const getUserByPhoneNumber = async (phoneNumber) => {
    const answer = await db('users').where({phone_number: phoneNumber}).first()
    return answer
}

export const checkFormData = async (username,email,phoneNumber) => {
    let answer = await db('users').where({username: username}).first()
    if(answer == undefined){

        answer = await db('users').where({email: email}).first()
        if(answer == undefined){
            answer = await db('users').where({phone_number: phoneNumber}).first()
            if(answer == undefined){
            
                return false
            }else{
                return 'phone'
            }
        }else{
            return 'email'
        }
    }else{
        return 'username'
    }


}

export const checkBlockList = async (ip) => {
    const answer = await db('blocklist').where({ip_address: ip}).first()
    return answer
}

export const addBlockList = async (ip) => {
    console.log('I am hereXXXX')
    const answer = await db('blocklist').insert({ip_address: ip})
    return answer
}

export const deleteBlockList = async () => {
    const currentDate = new Date()
    const currentDateMinus24 = new Date(currentDate.getTime() - 24*60*60*1000)
    const deleteIp = await db('blocklist').where('added_at', '<', currentDateMinus24).del() 
    console.log(deleteIp)
}

export const checkEffortsList = async (ip) => {
    const answer = await db('loginefforts').where({ip_address: ip}).first()
    return answer
}
export const addEffortsList = async (ip) => {
    console.log('I am hereXXXX')
    const answer = await db('loginefforts').insert({ip_address: ip, efforts: 1})
    return answer
}
export const updateEffortsList = async (ip) => {
    console.log('I am hereXXXX')
    const answer = await db('loginefforts').where({ ip_address: ip }).increment('efforts', 1);
    return answer
}

export const deleteEffortsList = async (ip) => {
   
    const deleteIp = await db('loginefforts').where({ip_address: ip}).del() 
    console.log(deleteIp)
}
// In this Module I create 2 functions for creating and getting user 
