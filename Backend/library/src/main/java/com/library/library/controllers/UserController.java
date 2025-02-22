package com.library.library.controllers;

import com.library.library.models.UserModel;
import com.library.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping
    public List<UserModel> getAllUsers() {
        return userService.getAllUsers();
    }

    // Obtener todos los usuarios solo (contraseña, rol, nombre, apellido, grado, email)
    @GetMapping("/some-data")
    public List<Map<String, Object>> getUsersSomeData() {
        return userService.getUsersSomeData();
    }

    //API para obtener Usuarios con la contraseña desencriptada
    @GetMapping("/with-password/{id}")
    public Map<String, Object> getAllUserWithPassword(@PathVariable("id") Integer id){
        return userService.getUserByIdWithPassword(id);
    }

    // API para guardar un nuevo usuario
    @PostMapping
    public UserModel saveUser(@RequestBody UserModel user) {
        return userService.saveUser(user);
    }

    //API para guardar un usuario sin contraseña
    @PostMapping("/without-password")
    public  UserModel saveUserWithoutPassword(@RequestBody UserModel user){
        return userService.saveUserWhithoutPassword(user);
    }

    // API para obtener un usuario por ID
    @GetMapping("/{id}")
    public Optional<UserModel> getUserById(@PathVariable("id") Integer id) {
        return userService.getUserById(id);
    }

    //API para editar un usuario
    @PutMapping("/update/{id}")
    public UserModel updateUserById(@RequestBody UserModel request, @PathVariable("id") Integer id){
        return this.userService.updateById(request, id);
    }

    //API para eliminar un usuario (solo cambia su status de 0 a 1, es decir de activo o inactivo)
    @PutMapping("/delete/{id}")
    public UserModel deleteUser(@PathVariable("id") Integer id){
        return this.userService.deleteUser(id);
    }


    // API de inicio de sesión
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String code = loginRequest.get("code");
        String password = loginRequest.get("password");

        try {
            UserModel user = userService.loginUser(code, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
