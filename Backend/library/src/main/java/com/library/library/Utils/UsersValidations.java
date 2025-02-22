package com.library.library.Utils;

import java.util.regex.Pattern;
import java.util.regex.Matcher;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;

public class UsersValidations {

    //Metodo para validar campos vacios
    private static boolean validateEmptyDataUser(String dataUser) {
        return dataUser != null && !dataUser.isEmpty();
    }

    //Metodo para validar user_name
    public static boolean validateUser_Name(String user_name) {
        if (!validateEmptyDataUser(user_name)) {
            throw new RuntimeException("Campo de nombre vacío");
        } else {
            String namePattern = "^[A-Za-zÑñÁáÉéÍíÓóÚú]{1,15}( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})*( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})?$";
            Pattern pattern = Pattern.compile(namePattern);
            Matcher matcher = pattern.matcher(user_name);
            return matcher.matches();
        }
    }

    //Metodo para validar user_last_name
    public static boolean validateUser_last_name(String user_last_name){
        if(!validateEmptyDataUser(user_last_name)){
            throw new RuntimeException("Campo de apellido vacío");
        }else{
            String lastnamePattern = "^[A-Za-zÑñÁáÉéÍíÓóÚú]{1,15}( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})*( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})?$";
            Pattern pattern = Pattern.compile(lastnamePattern);
            Matcher matcher = pattern.matcher(user_last_name);
            return matcher.matches();
        }
    }

    //metodo para validar mail
    public static boolean validateMail(String mail) {
        if (mail == null || mail.trim().isEmpty()) {
            return true;
        }

        String mailPattern = "^([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$";
        Pattern pattern = Pattern.compile(mailPattern);
        Matcher matcher = pattern.matcher(mail);
        return matcher.matches();
    }


    //Metodo para validar Role
    public static boolean validateRole(String role){
        String RolePattern = "^(?=.*[a-zA-ZñÑáéíóúÁÉÍÓÚ])[-_a-zA-ZñÑáéíóúÁÉÍÓÚ\\d]{0,20}$";
        Pattern pattern = Pattern.compile(RolePattern);
        Matcher matcher = pattern.matcher(role);
        return matcher.matches();
    }

    //Clave de encriptación de 24 bytes AES
    private static  final String ENCRYPT_KEY = "Contraseña_privada_2024";

    //Metodo para validar la contraseña y encriptarla
    public static String validatePassword(String password) {

        if (!validateEmptyDataUser(password)) {
            throw new RuntimeException("Campo de contraseña vacía");
        } else {
            //mínimo 8 caracteres, entre minúsculas y mayúsculas, y un solo caracter especial (solo uno)
            String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&*\\)\\(+=._-])(?!.*[!@#\\$%\\^&*\\)\\(+=._-].*[!@#\\$%\\^&*\\)\\(+=._-])[a-zA-Z0-9ÑñÁáÉéÍíÓóÚúüÜ!@#\\$%\\^&*\\)\\(+=._-]{8,20}$";
            Pattern pattern = Pattern.compile(passwordPattern);
            Matcher matcher = pattern.matcher(password);

            if (!matcher.matches()) {
                throw new RuntimeException("Contraseña Inválida");
            }

            try {
                return encrypt(password);
            } catch (Exception e) {
                throw new RuntimeException("Error encrypting password", e);
            }
        }
    }

    // Metodo para encriptar la contraseña
    public static String encrypt(String text) throws Exception {
        Key aesKey = new SecretKeySpec(ENCRYPT_KEY.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);

        byte[] encrypted = cipher.doFinal(text.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    // Metodo para desencriptar la contraseña
    public static String decrypt(String encrypted) throws Exception {
        byte[] encryptedBytes = Base64.getDecoder().decode(encrypted);
        Key aesKey = new SecretKeySpec(ENCRYPT_KEY.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, aesKey);

        return new String(cipher.doFinal(encryptedBytes));
    }

    //Metodo para validar el grado
    public static boolean validateGrade(String grade){
        if (grade == null || grade.trim().isEmpty()) {
            return true;
        }
        String gradePattern = "^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9-_ ]{1,20}$";
        Pattern pattern = Pattern.compile(gradePattern);
        Matcher matcher = pattern.matcher(grade);
        return matcher.matches();
    }

    //Metodo para validar cédula ecuatoriana
    public static boolean validateCode(String id) {
        if(!validateEmptyDataUser(id)){
            throw new RuntimeException("Campo de cédula vacía");
        }else{
            int total = 0;
            int idLength = 10;
            int[] coefficients = {2, 1, 2, 1, 2, 1, 2, 1, 2};
            int maxProvinceNumber = 24;
            int maxThirdDigit = 6;

            if (id.matches("[0-9]*") && id.length() == idLength) {
                int province = Integer.parseInt(id.charAt(0) + "" + id.charAt(1));
                int thirdDigit = Integer.parseInt(id.charAt(2) + "");

                if ((province > 0 && province <= maxProvinceNumber) && thirdDigit < maxThirdDigit) {
                    int receivedCheckDigit = Integer.parseInt(id.charAt(9) + "");

                    for (int i = 0; i < coefficients.length; i++) {
                        int value = coefficients[i] * Integer.parseInt(id.charAt(i) + "");
                        total = value >= 10 ? total + (value - 9) : total + value;
                    }

                    int calculatedCheckDigit = total >= 10 ? (total % 10) != 0 ? 10 - (total % 10) : (total % 10) : total;

                    if (calculatedCheckDigit == receivedCheckDigit) {
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    }

}
