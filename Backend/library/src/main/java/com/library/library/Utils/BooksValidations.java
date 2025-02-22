package com.library.library.Utils;


import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BooksValidations {

    //validar datos nulos o vacios
    public static boolean validateEmptyDataBook(String dataBook){
        return dataBook != null && !dataBook.isEmpty();
    }


    //validación del titulo
    public static boolean validateTitle(String title){
        if(!validateEmptyDataBook(title)){
            throw new RuntimeException("Campo de título vacío");
        }else{
            String titlePattern = "^.{0,30}$";
            Pattern pattern = Pattern.compile(titlePattern);
            Matcher matcher = pattern.matcher(title);
            return matcher.matches();
        }
    }

    //validación del autor
    public static boolean validateAuthor(String author){
        if(!validateEmptyDataBook(author)){
            throw new RuntimeException("Campo de autor vacío");
        }else{
            String authorPattern = "^.{0,30}$";
            Pattern pattern = Pattern.compile(authorPattern);
            Matcher matcher = pattern.matcher(author);
            return matcher.matches();
        }
    }

    //validación del lenguaje
    public static boolean validateLanguage(String language){
        if(!validateEmptyDataBook(language)){
            throw new RuntimeException("Campo de idioma vacío");
        }else{
            String languagePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s_-]{1,30}$";
            Pattern pattern = Pattern.compile(languagePattern);
            Matcher matcher = pattern.matcher(language);
            return matcher.matches();
        }
    }

    // Validación del código
    public static boolean validateCode(String code) {
        if (code == null) {
            throw new RuntimeException("Campo de código vacío");
        } else {
            String codePattern = "^[a-zA-Z0-9]{1,20}$";
            Pattern pattern = Pattern.compile(codePattern);
            Matcher matcher = pattern.matcher(code); // Convertir a String
            return matcher.matches();
        }
    }

    //Metodo para validar el grado
    public static boolean validateGrade(String grade){
        String gradePattern = "^[A-Za-z]{1,20}$";
        Pattern pattern = Pattern.compile(gradePattern);
        Matcher matcher = pattern.matcher(grade);
        return matcher.matches();
    }

    //Validación de la sección
    public static  boolean validateSection(String section){
        String sectionPattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{1,30}$";
        Pattern pattern = Pattern.compile(sectionPattern);
        Matcher matcher = pattern.matcher(section);
        return matcher.matches();

    }

    //Validación de descripción
    public static boolean validateDescription(String description){
        if(description == null || description.trim().isEmpty()){
            return true;
        }
        String descriptionPattern = "^(\\S+\\s*){1,2000}$";
        Pattern pattern = Pattern.compile(descriptionPattern);
        Matcher matcher = pattern.matcher(description);
        return matcher.matches();
    }

    //Validación de estado fisico
    public static boolean validatePhysical_State(String physical_state){
        if(physical_state == null || physical_state.trim().isEmpty()){
            return true;
        }
            String physicalStatePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{1,30}$";
            Pattern pattern = Pattern.compile(physicalStatePattern);
            Matcher matcher = pattern.matcher(physical_state);
            return matcher.matches();
    }


    //Validacion de precio
    public static boolean validatePrice(String priceStr) {
        if (priceStr == null || priceStr.isEmpty()) {
            return true;
        }

        if (!priceStr.matches("^\\d*(\\.\\d{0,2})?$")) {
            throw new IllegalArgumentException("El precio debe contener solo números y punto decimal, y tener como máximo dos decimales.");
        }

        try {
            BigDecimal price = new BigDecimal(priceStr);
            if (price.compareTo(BigDecimal.ZERO) < 0 || price.compareTo(new BigDecimal("10000")) > 0) {
                throw new IllegalArgumentException("El precio debe estar entre 0 y 10,000.");
            }
            return true;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("El precio no es un número válido.", e);
        }
    }


}
