const isAllowed = (user, allowed) => {
    const role = typeof(user.role) == 'string' && user.role.length > 0 && user.role in ['administrator', user]? role: undefined;
    if( typeof(role) == 'undefined' || role !== allowed) {
        return false
    }
    return true
}

module.exports = isAllowed