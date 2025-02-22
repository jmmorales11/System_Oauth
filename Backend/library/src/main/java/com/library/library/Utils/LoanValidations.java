package com.library.library.Utils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class LoanValidations {
    public static boolean validateDate(Date dateDevolution){

        if(dateDevolution==null){
            return true;
        }
        LocalDate devolutionDate = dateDevolution.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        LocalDate actualDate = LocalDate.now();

        if (devolutionDate.isBefore(actualDate) || devolutionDate.isEqual(actualDate)) {
            throw new RuntimeException("La fecha de devolución debe ser mayor a la fecha actual");
        }

        return true;
    }
}
