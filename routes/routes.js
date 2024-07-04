const express = require("express");
const router = express.Router();

const verifyAuth = require("../middlewares/VerifyAuth");
const verifyChangePassword = require("../middlewares/VerifyChangePassword");
const verifyChangeMail = require("../middlewares/VerifyChangeMail");
const verifyOffice = require("../middlewares/VerifyOffice");

const UserController = require("../controllers/UserController");
const FamiliarController = require("../controllers/FamiliarController");
const AddressController = require("../controllers/AddressController");
const CatchStudentController = require("../controllers/CatchStudentController");
const StudentController = require("../controllers/StudentController");
const UserOfficeController = require("../controllers/UserOfficeController");
const OfficeController = require("../controllers/OfficeController")

// Users routes
router.post("/login", UserController.login);
router.get("/login/testauth", verifyAuth, verifyOffice(["Coordenador(a)", "Professor(a)"]), UserController.testAuth);     //Rotas para testar os Middlewares
router.get("/login/testauth2", verifyAuth, UserController.testAuth);    //Fim das rotas para testar os Middlewares
router.post("/changepassword", verifyChangePassword, UserController.changePassword);
router.post("/sendMail", UserController.sendMail);
router.post("/UserRegister", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)"]), UserController.createUser);
router.delete("/UserDelete", verifyAuth, verifyOffice(["Diretor(a)", "Adminstrador(a)"]), UserController.deleteUser);
router.put("/changeMail", verifyChangeMail, UserController.updateEmail);
router.get("/logout", verifyAuth, UserController.logout);
router.get("/user/:id", UserController.getUser);
router.get("/getAllUsers", UserController.getAllUsers);
router.get("/searchUser/:search", UserController.searchUserForNameOrCPF);
router.put("/userUpdate", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)"]), UserController.updateUser);

// Familiars routes
router.post("/familiarRegister", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), FamiliarController.register);
router.get("/familiarsList", FamiliarController.getAllFamiliars);
router.put("/updateFamiliar", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), FamiliarController.updateFamiliar);
router.get("/getFamiliar/:idFamiliar", FamiliarController.getFamiliar);
router.get("/searchFamiliar/:search", FamiliarController.searchFamiliarForNameOrCPF);
router.delete("/deleteFamiliar", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), FamiliarController.delete);

// Addresses routes
router.post("/addressRegister", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), AddressController.register);
router.get("/addressesList", AddressController.getAllAddresses)
router.put("/updateAddress", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), AddressController.updateAddress);
router.delete("/deleteAddress", verifyAuth, AddressController.delete);
router.get("/address/:id", AddressController.getAddress);

// CatchStudents routes
router.post("/catchStudentRegister", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), CatchStudentController.register);
router.delete("/deleteCatchStudent", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), CatchStudentController.delete);
router.get("/getCatchStudent/:idStudent", CatchStudentController.getFamiliar)

// Students routes
router.post("/studentRegister", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), StudentController.register);
router.put("/updateStudent", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), StudentController.update);
router.delete("/deleteStudent", verifyAuth, verifyOffice(["Diretor(a)", "Secretário(a)", "Coordenador(a)"]), StudentController.delete);
router.get("/getStudent/:enrollment", StudentController.getStudent);
router.get("/studentList", StudentController.getAllStudent);
router.get("/searchStudent/:search", StudentController.searchStudentForNameOrEnrollment);

//UserOffice routes
router.post("/registerUserOffice", UserOfficeController.register);
router.delete("/deleteUserOffice", UserOfficeController.delete);
router.get("/getUserOffice/:idUser", UserOfficeController.getUserOffice);

//Office routes
router.get("/getOffices", OfficeController.getAllOffices);

module.exports = router;