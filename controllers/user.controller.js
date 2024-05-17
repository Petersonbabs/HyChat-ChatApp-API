import usersCol from '../models/user.model.js';

// get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersCol.find()
        if(!users){
            res.status(404).json({
                status: 'error',
                message: 'Unable to fetch users.'
            })
            return
        }

        res.status(200).json({
            status: 'success',
            message: 'All users successfully fetched!',
            users
        })

    } catch (error) {
        console.log('Error occured at the get all users controller:  '+ error)
        next(error)
    }
}