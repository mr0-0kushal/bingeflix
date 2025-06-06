import mongoose , {Schema} from 'mongoose';
// import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullname: {
        type: String,
        required:true,
    },
    username: {
        type:String,
        unique:true,
        lowercase:true,
        trim: true,
        required:true,
        index: true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    avatar:{
        type:String
    },
    address: {
        type: String
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
}
)

// userSchema.plugin(mongooseAggregatePaginate)

//Hashing of the password just before save
userSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//Comparing the hashed password with userInput password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

//Generating Token Access and Refresh using JWT.
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User', userSchema);