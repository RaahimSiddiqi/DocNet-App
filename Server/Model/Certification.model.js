const { checkSchema } = require("express-validator");
const db = require("../DB");

const Certification = {};

Certification.schema = {
    userName: {
        isString: true,
        isLength: {
            options: {
                min: 3
            }
        }
    },
    instituteName: {
        isString: true,
        isLength: {
            options: {
                min: 3
            }
        }
    },
    degreeTitle: {
        isString: true,
        isLength: {
            options: {
                min: 2
            }
        }
    },
    startDate: {
        isString: true,
        isDate: true,
    },
    endDate: {
        isString: true,
        isDate: true,
    }
};

Certification.certify = new function(){
    this.params = ["instituteName", "degreeTitle", "startDate", "endDate"];
    this.service = (data, results) => {
        console.log(data);
        let sql = "CALL certifyUser(?, ?, ?, str_to_date(?, \'%Y-%m-%d\'), str_to_date(?, \'%Y-%m-%d\'));"
        // let sql = "UPDATE User SET userRole='DOCTOR' WHERE userName = ?; \
        //            INSERT INTO Doctor(userName) values(?); \
        //            INSERT INTO Certification values(?, ?, ?, str_to_date(?, \'%Y-%m-%d\'), str_to_date(?, \'%Y-%m-%d\'));";
        db.query(sql,
                [data.userName,
                 data.instituteName,
                 data.degreeTitle,
                 data.startDate,
                 data.endDate], 
                // [data.userName,
                // data.userName,
                // data.userName,
                // data.instituteName,
                // data.degreeTitle,
                // data.startDate,
                // data.endDate],
                (err, data) => results(!err? null : err, data));
    }
}

module.exports = Certification;