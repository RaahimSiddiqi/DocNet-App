use db;

CREATE TABLE User(
    userName  VARCHAR(255),
    pass      VARCHAR(255) NOT NULL,
	userRole  enum('USER', 'DOCTOR') NOT NULL,
    firstName VARCHAR(255),
    lastName  VARCHAR(255),
    email     VARCHAR(255) UNIQUE,
    dob 	  DATE,
    city	  VARCHAR(255),
    gender    enum('MALE', 'FEMALE', 'OTHER'),
    about     TEXT,
    theme     enum('DARK', 'LIGHT'),
    privacy   enum('0', '1', '2'),
    joinDate  DATE DEFAULT ( CURRENT_DATE ),
    primary key (userName)
);

CREATE TABLE Doctor(
	userName  VARCHAR(255),
    docPoints INTEGER default 0,
    PRIMARY KEY(userName),
    FOREIGN KEY(userName) REFERENCES User(userName)
);

CREATE TABLE Certification(
    userName    VARCHAR(255),
    instituteName  VARCHAR(255),
	degreeTitle    VARCHAR(255),
    startDate 	   DATE,
    endDate 	   DATE,
    PRIMARY KEY(docUserName),
    FOREIGN KEY(docUserName) REFERENCES Doctor(userName)
);

CREATE TABLE History(
	recordId 	   INTEGER AUTO_INCREMENT,
    userName	   VARCHAR(255),
    ailmentName    VARCHAR(255),
    description    TEXT,
    symptoms	   TEXT,
    startDate	   DATE,
    endDate 	   DATE,
	PRIMARY KEY(recordId),
    FOREIGN KEY(userName) REFERENCES User(userName)
);

CREATE TABLE Post(
	postId 		 INTEGER AUTO_INCREMENT,
    userName     VARCHAR(255),
    title  		 VARCHAR(255) NOT NULL,
    category     VARCHAR(255) NOT NULL,
    body 		 TEXT,
    creationTime timestamp default ( current_timestamp() ),
    PRIMARY KEY(postId),
    FOREIGN KEY(userName) REFERENCES User(userName)
);

CREATE TABLE Comment(
	commentId    	INTEGER AUTO_INCREMENT,
    parentCommentId INTEGER,
    postId       	INTEGER,
	userName 	    VARCHAR(255),
	body 	     	TEXT,
    upvotes   	 	INTEGER default 0,
    creationTime 	timestamp,
    PRIMARY KEY(commentId),
	FOREIGN KEY(parentCommentId) REFERENCES Comment(commentId),
    FOREIGN KEY(postId) REFERENCES Post(postId),
    FOREIGN KEY(userName) REFERENCES User(userName)    
);

show tables;

drop table User;
drop table Certification;
drop table Doctor;
drop table History;
drop table Post;
drop table Comment;

desc User;
desc Doctor;
desc Certification;
desc History;
desc Post;
desc Comment;

select * from User;
select * from Doctor;
select * from Certification;
select * from User U, UserProfile Up, Doctor D, Certification C where U.userName = Up.userName and U.userName = D.docUserName and D.docUserName = C.docUserName;



DELIMITER //
CREATE PROCEDURE certifyUser(IN in_userName VARCHAR(255), IN in_instituteName VARCHAR(255), IN in_degreeTitle VARCHAR(255), IN in_startDate DATE, IN in_endDate DATE)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;
		UPDATE User set userRole = 'DOCTOR' WHERE userName = in_userName;
		INSERT INTO Doctor VALUES(in_userName, 0);
		INSERT INTO Certification VALUES(in_userName, in_instituteName, in_degreeTitle, in_startDate, in_endDate);
    COMMIT;
END;
//
DELIMITER ;