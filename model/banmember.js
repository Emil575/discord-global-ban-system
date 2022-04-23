const {
    model,
    Schema
} = require("mongoose")

const schema = new Schema({
    Random: String,
    BanMemberId: String,
    Reason: String,
    RequestServer: String,
    RequestModerator: String,
})
module.exports = model("BanMembers", schema)