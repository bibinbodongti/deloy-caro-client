const bcrypt = require('bcryptjs');
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        var result = await bcrypt.hash(password, salt);
        return result;
    } catch (error) {
        throw new Error('Hashing failed', error)
    }
}
export default hashPassword;