package com.library.library.services;

import com.library.library.Utils.UsersValidations;
import com.library.library.excepcion.ValidationException;
import com.library.library.models.LoanModel;
import com.library.library.models.UserModel;
import com.library.library.repositories.ILoanRepository;
import com.library.library.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ILoanRepository loanRepository;

    // Get all user data
    public List<UserModel> getAllUsers() {
        try {
            List<UserModel> users = userRepository.findAll();
            if (users.isEmpty()) {
                return new ArrayList<>();
            }
            return users;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la lista de usuarios", e);
        }
    }


    //Get all user data without encrypted password
    public Map<String, Object> getUserByIdWithPassword(Integer id) {
        Optional<UserModel> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            UserModel user = userOptional.get();
            Map<String, Object> userData = new LinkedHashMap<>();
            userData.put("code", user.getCode());
            userData.put("role", user.getRole());
            userData.put("user_name", user.getUser_name());
            userData.put("user_last_name", user.getUser_last_name());
            userData.put("grade", user.getGrade());
            userData.put("mail", user.getMail());

            try {
                String decryptedPassword = UsersValidations.decrypt(user.getPassword());
                userData.put("password", decryptedPassword);
            } catch (Exception e) {
                throw new RuntimeException("Error decrypting password for user: " + user.getUser_name());
            }

            return userData;
        } else {
            throw new RuntimeException("User with id " + id + " not found");
        }
    }


    //get some user data (filter)
    public List<Map<String, Object>> getUsersSomeData() {

        try {
            List<UserModel> users = getAllUsers();
            List<Map<String, Object>> usersWithoutPassword = new ArrayList<>();
            if (users.isEmpty()) {
                return new ArrayList<>();
            }
            for (UserModel user : users) {
                Map<String, Object> userData = new LinkedHashMap<>();
                userData.put("id_user", user.getId_user());
                userData.put("code", user.getCode());
                userData.put("role", user.getRole());
                userData.put("user_name", user.getUser_name());
                userData.put("user_last_name", user.getUser_last_name());
                userData.put("grade", user.getGrade());
                userData.put("mail", user.getMail());

                usersWithoutPassword.add(userData);
            }
            return usersWithoutPassword;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la lista de usuarios", e);
        }
    }

    // Save a new user (administrator)
    public UserModel saveUser(UserModel user) {

        List<String> errors = new ArrayList<>();

        Optional<UserModel> existingUser = userRepository.findByCode(user.getCode());
        if(existingUser.isPresent()){
            throw new RuntimeException("El usuario con la cédula "+ user.getCode()+" ya se encuentra registrado dentro del sistema");
        }

        if (!UsersValidations.validateUser_Name(user.getUser_name())) {
            errors.add("Nombres Inválido");
        }
        if (!UsersValidations.validateUser_last_name(user.getUser_last_name())) {
            errors.add("Apellidos Inválidos");
        }
        if(!UsersValidations.validateMail(user.getMail())){
            errors.add("Correo Electrónico Inválido");
        }
        if(!UsersValidations.validateRole(user.getRole())){
            errors.add("Rol Inválido");
        }

        try {
            String encryptedPassword = UsersValidations.validatePassword(user.getPassword());
            user.setPassword(encryptedPassword);
        } catch (RuntimeException e) {
            errors.add(e.getMessage());
        }

        if(!UsersValidations.validateCode(user.getCode())){
            errors.add("Cédula Inválida");
        }

        if(!UsersValidations.validateGrade(user.getGrade())){
            errors.add("Grado Inválido");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        user.setStatus(true);
        return userRepository.save(user);
    }

    //Save new user (only students and teachers)
    public UserModel saveUserWhithoutPassword(UserModel user) {
        List<String> errors = new ArrayList<>();

        Optional<UserModel> existingUser = userRepository.findByCode(user.getCode());
        if(existingUser.isPresent()){
            throw new RuntimeException("El usuario con la cédula "+ user.getCode()+" ya se encuentra registrado dentro del sistema");
        }

        if (!UsersValidations.validateUser_Name(user.getUser_name())) {
            errors.add("Nombres Inválidos");
        }
        if (!UsersValidations.validateUser_last_name(user.getUser_last_name())) {
            errors.add("Apellidos Inválidos");
        }
        if (!UsersValidations.validateMail(user.getMail())) {
            errors.add("Correo Electrónico Inválido");
        }
        if (!UsersValidations.validateRole(user.getRole())) {
            errors.add("Rol Inválido");
        }
        if (!UsersValidations.validateCode(user.getCode())) {
            errors.add("Cédula Inválida");
        }
        if (!UsersValidations.validateGrade(user.getGrade())) {
            errors.add("Grado Inválido");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        user.setPassword("");
        user.setStatus(true);

        return userRepository.save(user);
    }


    // Get user by id
    public Optional<UserModel> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    //Update user data
    public UserModel updateById(UserModel request, Integer id){
        List<String> errors = new ArrayList<>();
        Optional<UserModel> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()) {
            UserModel user = userOptional.get();

            if (!UsersValidations.validateUser_Name(request.getUser_name())) {
                errors.add("Nombres Inválidos");
            }
            if (!UsersValidations.validateUser_last_name(request.getUser_last_name())) {
                errors.add("Apellidos Inválidos");
            }
            if (!UsersValidations.validateMail(request.getMail())) {
                errors.add("Correo Electrónico Inválido");
            }
            if (!UsersValidations.validateRole(request.getRole())) {
                errors.add("Rol Inválido");
            }
            if(!UsersValidations.validateGrade(request.getGrade())){
                errors.add("Grado Inválido");
            }

            // Validación del código (si se ha modificado)
            if (!request.getCode().equals(user.getCode())) {
                if (!UsersValidations.validateCode(request.getCode())) {
                    errors.add("Cédula Inválida");
                }

                Optional<UserModel> existingUser = userRepository.findByCode(request.getCode());
                if (existingUser.isPresent()) {
                    errors.add("El usuario con la cédula "+ request.getCode()+" ya se encuentra registrado dentro del sistema");
                }
            }

            // Validar y actualizar la contraseña solo si no está vacía
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                try {
                    String encryptedPassword = UsersValidations.validatePassword(request.getPassword());
                    user.setPassword(encryptedPassword);
                } catch (RuntimeException e) {
                    errors.add(e.getMessage());
                }
            }

            if (!errors.isEmpty()) {
                throw new ValidationException(errors);
            }

            user.setUser_name(request.getUser_name());
            user.setUser_last_name(request.getUser_last_name());
            user.setMail(request.getMail());
            user.setRole(request.getRole());
            user.setGrade(request.getGrade());
            user.setCode(request.getCode());

            return userRepository.save(user);
        } else {
            throw new RuntimeException("Este usuario no se encuentra dentro de la base de datos");
        }
    }

    // "Delete" Update user status to disable in the system
    public UserModel deleteUser(Integer id){
        try{
            Optional<UserModel> userOptional = userRepository.findById(id);
            if(userOptional.isPresent()){
                UserModel user = userOptional.get();
                boolean userLoanActive = loanRepository.findAll().stream().anyMatch(loan -> loan.getUser().getId_user() == id
                && !loan.isConfirm_devolution());
                if (userLoanActive) {
                    throw new RuntimeException("El usuario tiene préstamos pendientes y no puede ser deshabilitado.");
                }
                user.setStatus(false);
                return userRepository.save(user);
            }else{
                throw new RuntimeException("Este usuario no se encuentra dentro de la base de datos");
            }
        } catch (Exception e) {
            throw e;
        }
    }


    //Login in the system
    public UserModel loginUser(String code, String password) {
        Optional<UserModel> existingUser = userRepository.findByCode(code);
        if (existingUser.isPresent()) {
            UserModel user = existingUser.get();

            if (!user.isStatus()) {
                throw new RuntimeException("Este usuario se encuentra inhabilitado del sistema, por favor contactarse con el administrador.");
            }

            // Verify Block user
            if (user.getLock_time() != null) {
                long timeDifference = System.currentTimeMillis() - user.getLock_time().getTime();
                if (timeDifference > 30 * 60 * 1000) { // More 30 minutes
                    user.setFailed_attempts(0); // Restart failed attempts
                    user.setLock_time(null);
                    userRepository.save(user);
                } else {
                    throw new RuntimeException("Tu cuenta se encuentra bloqueada por superar los límites de intentos fallidos. Espera 30 minutos para volver a intentarlo.");
                }
            }

            // Verify password
            try {
                String decryptedPassword = UsersValidations.decrypt(user.getPassword());
                if (decryptedPassword.equals(password)) {
                    // Successful password, restart failed attempts
                    user.setFailed_attempts(0);
                    userRepository.save(user);
                    return user;
                } else {
                    // Failed password
                    int failedAttempts = user.getFailed_attempts() + 1;
                    user.setFailed_attempts(failedAttempts);

                    if (failedAttempts >= 3) {
                        // Block user after 3 failed attempts
                        user.setLock_time(new Timestamp(System.currentTimeMillis()));
                        userRepository.save(user);
                        throw new RuntimeException("Contraseña incorrecta: Tu cuenta ha sido bloqueada por superar el límite de intentos.");
                    } else {
                        userRepository.save(user);
                        throw new RuntimeException("Contraseña incorrecta. Tienes " + (3 - failedAttempts) + " intentos restantes.");
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Contraseña incorrecta.");
            }
        } else {
            throw new RuntimeException("Este usuario no se encuentra dentro de la base de datos.");
        }
    }

}
