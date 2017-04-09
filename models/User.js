const mongoose = require('mongoose');
const Role = mongoose.model('Role');
const ObjectId = mongoose.Schema.Types.ObjectId;
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        articles: [{type: ObjectId , ref: 'Article'}],
        roles: [{type: ObjectId , ref: 'Role'}],
        salt: {type: String, required: true}
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   }
});

userSchema.method({
   isAuthor: function(article) {
       if(!article){
           return false;

       }
       let id = article.author;


       return this.id == id;

   },

   isInRole: function(roleName){
        return Role.findOne({name: roleName}).then(role => {
            if(!role){
                return false;
            }
            let isInRole = this.roles.indexOf(role.id) !== -1;
            return isInRole;
        });
   }
});



const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.initialize = () => {
    let email = 'admin@sasho.com';
    User.findOne({email: email}).then(admin =>{
       if(admin){
          return;
       }
       Role.findOne({name:'Admin'}).then(role =>{
           if(!role){
               return;
           }
           let salt = encryption.generateSalt();
           let passwordHash = encryption.hashPassword('admin123', salt);

           let adminUser = {
               email : email,
               fullName: 'Admin',
               roles: [role.id],
               articles: [],
               salt: salt,
               passwordHash: passwordHash
           };

           User.create(adminUser).then(user=> {
               role.users.push(user.id);
               role.save();
           });
       });

    });

};



