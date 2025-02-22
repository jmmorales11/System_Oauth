package com.library.library.repositories;


import com.library.library.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository //Clase que permite hacer querys a una base de datos

public interface IUserRepository extends JpaRepository<UserModel, Integer> {
    Optional<UserModel> findByCode(String code);

}
