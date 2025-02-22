package com.library.library.repositories;

import com.library.library.models.LoanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ILoanRepository extends JpaRepository<LoanModel, Integer> {

}
