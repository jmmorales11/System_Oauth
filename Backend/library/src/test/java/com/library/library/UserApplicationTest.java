package com.library.library;

import com.library.library.Utils.UsersValidations;
import com.library.library.excepcion.ValidationException;
import com.library.library.models.LoanModel;
import com.library.library.models.UserModel;
import com.library.library.repositories.ILoanRepository;
import com.library.library.repositories.IUserRepository;
import com.library.library.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Timestamp;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserApplicationTest {

	@InjectMocks
	private UserService userService;

	@Mock
	private IUserRepository userRepository;

	@Mock
	private ILoanRepository loanRepository;

	// Get all User Successful
	@Test
	void getAllUsers_UserRegisterIsNotEmpty(){
		UserModel user = new UserModel();
		UserModel user2 = new UserModel();

		user.setUser_name("Steven");
		user.setUser_last_name("Pozo");
		user.setMail("stevenpozo0999@gmail.com");
		user.setRole("student");
		user.setPassword("Steven12345.");
		user.setCode("1753368099");

		user2.setUser_name("Jefferson");
		user2.setUser_last_name("Pozo");
		user2.setMail("stevenpozo0999@gmail.com");
		user2.setRole("student");
		user2.setPassword("Steven12345.");
		user2.setCode("0400911897");


		List<UserModel> userList = Arrays.asList(user,user2);
		when(userRepository.findAll()).thenReturn(userList);

		List<UserModel> users = userService.getAllUsers();

		assertNotNull(users);
		assertEquals(2, users.size());
		assertEquals("Steven", users.get(0).getUser_name());
		assertEquals("Jefferson", users.get(1).getUser_name());
	}

	// Get all User Exception
	@Test
	void getAllUsers_UserRegisterIsEmpty() {
		when(userRepository.findAll()).thenReturn(Collections.emptyList());

		List<UserModel> users = userService.getAllUsers();
		assertNotNull(users);
		assertTrue(users.isEmpty(),"Se esperaba que la lista de usuarios estuviera vacía");
	}

	//Get All user Error
	@Test
	void getAllUsers_DatabaseError() {
		when(userRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

		try {
			userService.getAllUsers();
			fail("Se esperaba una excepción RuntimeException");
		} catch (RuntimeException e) {
			assertEquals("Error al obtener la lista de usuarios", e.getMessage());
		}
	}

	/*------------------------------------------------------------------------------------------------------*/

	//Get some user data successful
	@Test
	void getUsersSomeData_RegisterIsNotEmpty() {
		UserModel user1 = new UserModel();
		user1.setId_user(1);
		user1.setUser_name("Steven");
		user1.setUser_last_name("Pozo");
		user1.setMail("stevenpozo0999@gmail.com");
		user1.setRole("student");
		user1.setPassword("encryptedPassword123");
		user1.setCode("1753368099");
		user1.setGrade("10");

		UserModel user2 = new UserModel();
		user2.setId_user(2);
		user2.setUser_name("Jefferson");
		user2.setUser_last_name("Pozo");
		user2.setMail("jeffersonpozo@gmail.com");
		user2.setRole("student");
		user2.setPassword("encryptedPassword456");
		user2.setCode("0400911897");
		user2.setGrade("11");

		List<UserModel> userList = Arrays.asList(user1, user2);
		when(userService.getAllUsers()).thenReturn(userList);

		List<Map<String, Object>> result = userService.getUsersSomeData();

		assertNotNull(result);
		assertEquals(2, result.size());

		Map<String, Object> userData1 = result.get(0);
		assertEquals(1, userData1.get("id_user"));
		assertEquals("1753368099", userData1.get("code"));
		assertEquals("student", userData1.get("role"));
		assertEquals("Steven", userData1.get("user_name"));
		assertEquals("Pozo", userData1.get("user_last_name"));
		assertEquals("10", userData1.get("grade"));
		assertEquals("stevenpozo0999@gmail.com", userData1.get("mail"));

		Map<String, Object> userData2 = result.get(1);
		assertEquals(2, userData2.get("id_user"));
		assertEquals("0400911897", userData2.get("code"));
		assertEquals("student", userData2.get("role"));
		assertEquals("Jefferson", userData2.get("user_name"));
		assertEquals("Pozo", userData2.get("user_last_name"));
		assertEquals("11", userData2.get("grade"));
		assertEquals("jeffersonpozo@gmail.com", userData2.get("mail"));
	}

	// Get some user data Exception
	@Test
	void getUsersSomeData_RegisterIsEmpty() {
		when(userRepository.findAll()).thenReturn(Collections.emptyList());

		List<Map<String, Object>> users = userService.getUsersSomeData();
		assertNotNull(users);
		assertTrue(users.isEmpty(),"Se esperaba que la lista de usuarios estuviera vacía");
	}

	//Get some user data Error
	@Test
	void getUsersSomeData_DatabaseError() {
		when(userRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

		try {
			userService.getUsersSomeData();
			fail("Se esperaba una excepción RuntimeException");
		} catch (RuntimeException e) {
			assertEquals("Error al obtener la lista de usuarios", e.getMessage());
		}
	}

/*----------------------------------------------------------------------------------------------------------*/

	// Save user successful (only teachers and administrator)
	@Test
	void SaveUser_Success() {
		String passwordEncrypt;

		UserModel user = new UserModel();
		user.setUser_name("Alejandro Sebastián");
		user.setUser_last_name("Villa de la Cruz");
		user.setMail("alejandroV@gmail.com");
		user.setRole("student");
		user.setPassword("Steven12345.");
		user.setCode("1753368099");
		user.setGrade("secundaria");
		passwordEncrypt = UsersValidations.validatePassword(user.getPassword());


		when(userRepository.findByCode(user.getCode())).thenReturn(Optional.empty());
		when(userRepository.save(any(UserModel.class))).thenReturn(user);
		UserModel savedUser = userService.saveUser(user);

		assertNotNull(savedUser);
		assertEquals("Alejandro Sebastián", savedUser.getUser_name());
		assertEquals("Villa de la Cruz", savedUser.getUser_last_name());
		assertEquals("alejandroV@gmail.com", savedUser.getMail());
		assertEquals("student", savedUser.getRole());
		assertEquals(passwordEncrypt, savedUser.getPassword());
		assertEquals("1753368099", savedUser.getCode());
		assertEquals("secundaria",savedUser.getGrade());

		verify(userRepository, times(1)).save(any(UserModel.class));
	}

	// Save user when the user is already register (only teachers and administrator)
	@Test
	void SaveUser_UserAlreadyRegistered() {
		UserModel existingUser = new UserModel();
		existingUser.setCode("1753368077");

		UserModel newUser = new UserModel();
		newUser.setCode("1753368077");

		when(userRepository.findByCode(newUser.getCode())).thenReturn(Optional.of(existingUser));

		try {
			userService.saveUser(newUser);
			fail("Se esperaba una excepción RuntimeException para usuario ya registrado");
		} catch (RuntimeException e) {
			assertEquals(
					"El usuario con la cédula 1753368077 ya se encuentra registrado dentro del sistema",
					e.getMessage()
			);
		}
		verify(userRepository, times(0)).save(any(UserModel.class));
	}

	// Test for saving user when user data is invalid (only teachers and administrator)
	@Test
	void SaveUser_InvalidData() {
		UserModel invalidUser = new UserModel();
		invalidUser.setUser_name("Juan123");
		invalidUser.setUser_last_name("Pérez!!!");
		invalidUser.setMail("juancorreo.com");
		invalidUser.setRole(";:");
		invalidUser.setPassword("short!!!!!<>");
		invalidUser.setCode("17533680772");
		invalidUser.setGrade("<><><>");

		when(userRepository.findByCode(invalidUser.getCode())).thenReturn(Optional.empty());

		try {
			userService.saveUser(invalidUser);
			fail("Se esperaba una excepción ValidationException para datos inválidos");
		} catch (ValidationException e) {
			List<String> errors = e.getErrors();
			assertTrue(errors.contains("Nombres Inválido"), "Error esperado: Nombres Inválido");
			assertTrue(errors.contains("Apellidos Inválidos"), "Error esperado: Apellidos Inválidos");
			assertTrue(errors.contains("Correo Electrónico Inválido"), "Error esperado: Correo Electrónico Inválido");
			assertTrue(errors.contains("Rol Inválido"), "Error esperado: Rol Inválido");
			assertTrue(errors.contains("Contraseña Inválida"), "Error esperado: Contraseña Inválida");
			assertTrue(errors.contains("Cédula Inválida"), "Error esperado: Cédula Inválida");
			assertTrue(errors.contains("Grado Inválido"), "Error esperado: Grado Inválido");
		}

		verify(userRepository, times(0)).save(any(UserModel.class));
	}

	/*--------------------------------------------------------------------------------------------------------------*/

	// Save user successful (only students and teachers)
	@Test
	void saveUserWhithoutPassword_Success() {
		String passwordEncrypt;

		UserModel user = new UserModel();
		user.setUser_name("Alejandro Sebastián");
		user.setUser_last_name("Villa de la Cruz");
		user.setMail("alejandroV@gmail.com");
		user.setRole("student");
		user.setCode("1753368099");
		user.setGrade("secundaria");

		when(userRepository.findByCode(user.getCode())).thenReturn(Optional.empty());
		when(userRepository.save(any(UserModel.class))).thenReturn(user);
		UserModel savedUser = userService.saveUserWhithoutPassword(user);

		assertNotNull(savedUser);
		assertEquals("Alejandro Sebastián", savedUser.getUser_name());
		assertEquals("Villa de la Cruz", savedUser.getUser_last_name());
		assertEquals("alejandroV@gmail.com", savedUser.getMail());
		assertEquals("student", savedUser.getRole());
		assertEquals("", savedUser.getPassword());
		assertEquals("1753368099", savedUser.getCode());
		assertEquals("secundaria",savedUser.getGrade());

		verify(userRepository, times(1)).save(any(UserModel.class));
	}

	// Save user when the user is already register (only students and teachers)
	@Test
	void saveUserWhithoutPassword_UserAlreadyRegistered() {
		UserModel existingUser = new UserModel();
		existingUser.setCode("1753368077");

		UserModel newUser = new UserModel();
		newUser.setCode("1753368077");

		when(userRepository.findByCode(newUser.getCode())).thenReturn(Optional.of(existingUser));

		try {
			userService.saveUserWhithoutPassword(newUser);
			fail("Se esperaba una excepción RuntimeException para usuario ya registrado");
		} catch (RuntimeException e) {
			assertEquals(
					"El usuario con la cédula 1753368077 ya se encuentra registrado dentro del sistema",
					e.getMessage()
			);
		}
		verify(userRepository, times(0)).save(any(UserModel.class));
	}

	// Test for saving user when user data is invalid (only students and teachers)
	@Test
	void saveUserWhithoutPassword_InvalidData() {
		UserModel invalidUser = new UserModel();
		invalidUser.setUser_name("Juan123");
		invalidUser.setUser_last_name("Pérez!!!");
		invalidUser.setMail("juancorreo.com");
		invalidUser.setRole("in2222;;");
		invalidUser.setGrade("<><>>");
		invalidUser.setCode("17533680772");

		when(userRepository.findByCode(invalidUser.getCode())).thenReturn(Optional.empty());

		try {
			userService.saveUserWhithoutPassword(invalidUser);
			fail("Se esperaba una excepción ValidationException para datos inválidos");
		} catch (ValidationException e) {
			List<String> errors = e.getErrors();
			assertTrue(errors.contains("Nombres Inválidos"), "Error esperado: Nombres Inválidos");
			assertTrue(errors.contains("Apellidos Inválidos"), "Error esperado: Apellidos Inválidos");
			assertTrue(errors.contains("Correo Electrónico Inválido"), "Error esperado: Correo Electrónico Inválido");
			assertTrue(errors.contains("Rol Inválido"), "Error esperado: Rol Inválido");
			assertTrue(errors.contains("Grado Inválido"), "Error esperado: Grado Inválido");
			assertTrue(errors.contains("Cédula Inválida"), "Error esperado: Cédula Inválida");
		}

		verify(userRepository, times(0)).save(any(UserModel.class));
	}
	/*----------------------------------------------------------------------------------------------------------*/


	//Get user by id
	@Test
	void getUserById_Success() {
		UserModel user = new UserModel();
		user.setId_user(1);
		user.setUser_name("Steven");

		when(userRepository.findById(1)).thenReturn(Optional.of(user));

		Optional<UserModel> result = userService.getUserById(1);

		assertTrue(result.isPresent());
		assertEquals("Steven", result.get().getUser_name());
	}

	/*-----------------------------------------------------------------------------------------------------*/

	//Update user seccessful
	@Test
	void updateById_Success() {
		UserModel existingUser = new UserModel();
		existingUser.setId_user(1);
		existingUser.setUser_name("Roberto");
		existingUser.setUser_last_name("Sarmiento");
		existingUser.setMail("roberto@example.com");
		existingUser.setRole("student");
		existingUser.setGrade("secundaria");
		existingUser.setCode("1753368099");


		UserModel updatedUser = new UserModel();
		updatedUser.setUser_name("Roberto Updated");
		updatedUser.setUser_last_name("Sarmiento update");
		updatedUser.setMail("roberto@example.com.ec");
		updatedUser.setRole("teacher");
		updatedUser.setGrade("secundaria");
		updatedUser.setCode("1753368099");

		when(userRepository.findById(1)).thenReturn(Optional.of(existingUser));
		when(userRepository.save(any(UserModel.class))).thenReturn(updatedUser);

		UserModel result = userService.updateById(updatedUser, 1);

		assertNotNull(result);
		assertEquals("Roberto Updated", result.getUser_name());
		assertEquals("Sarmiento update",result.getUser_last_name());
		assertEquals("roberto@example.com.ec", result.getMail());
		assertEquals("teacher", result.getRole());
		assertEquals("1753368099", result.getCode());
	}

	//User update with code duplicate
	@Test
	void updateById_DuplicateCode() {
		UserModel existingUser = new UserModel();
		existingUser.setId_user(1);
		existingUser.setUser_name("Roberto");
		existingUser.setUser_last_name("Sarmiento");
		existingUser.setMail("roberto@example.com");
		existingUser.setRole("student");
		existingUser.setGrade("secundaria");
		existingUser.setCode("1753368099");

		UserModel updatedUser = new UserModel();
		updatedUser.setUser_name("Roberto Updated");
		updatedUser.setUser_last_name("Sarmiento update");
		updatedUser.setMail("roberto@example.com.ec");
		updatedUser.setRole("teacher");
		updatedUser.setGrade("secundaria");
		updatedUser.setCode("1234567890");

		when(userRepository.findById(1)).thenReturn(Optional.of(existingUser));

		when(userRepository.findByCode("1234567890")).thenReturn(Optional.of(new UserModel()));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			userService.updateById(updatedUser, 1);
		});

		assertNotNull(exception);
		List<String> errors = exception.getErrors();
		assertTrue(errors.contains("El usuario con la cédula 1234567890 ya se encuentra registrado dentro del sistema"));
	}

	/*----------------------------------------------------------------------------------------------------------------*/
	// Disable user successful
	@Test
	void deleteUser_Success() {
		UserModel user = new UserModel();
		user.setId_user(1);
		user.setUser_name("Steven");
		user.setStatus(true);

		when(userRepository.findById(1)).thenReturn(Optional.of(user));

		when(loanRepository.findAll()).thenReturn(Collections.emptyList());

		when(userRepository.save(any(UserModel.class))).thenReturn(user);

		UserModel result = userService.deleteUser(1);

		assertNotNull(result);
		assertFalse(result.isStatus());
	}

	//Disable user with a loan active
	@Test
	void deleteUser_WithLoanActive() {
		UserModel user = new UserModel();
		user.setId_user(1);
		user.setUser_name("Steven");
		user.setStatus(true);

		when(userRepository.findById(1)).thenReturn(Optional.of(user));

		LoanModel loan = new LoanModel();
		loan.setUser(user);
		loan.setConfirm_devolution(false);

		when(loanRepository.findAll()).thenReturn(Collections.singletonList(loan));

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			userService.deleteUser(1);
		});

		assertEquals("El usuario tiene préstamos pendientes y no puede ser deshabilitado.", exception.getMessage());
	}

	//Disable user not found
	@Test
	void deleteUser_NotFound() {
		when(userRepository.findById(1)).thenReturn(Optional.empty());

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			userService.deleteUser(1);
		});

		assertEquals("Este usuario no se encuentra dentro de la base de datos", exception.getMessage());
	}

	/*----------------------------------------------------------------------------------------------------------*/
	//Login Successful
	@Test
	void loginUser_Success() throws Exception {
		String validCode = "12345";
		String validPassword = "password123";

		UserModel user = new UserModel();
		user.setCode(validCode);
		user.setPassword(UsersValidations.encrypt(validPassword));
		user.setStatus(true);
		user.setFailed_attempts(0);
		user.setLock_time(null);

		when(userRepository.findByCode(validCode)).thenReturn(Optional.of(user));

		UserModel result = userService.loginUser(validCode, validPassword);

		assertNotNull(result);
		assertEquals(validCode, result.getCode());
		assertEquals(0, result.getFailed_attempts());
	}

	//Login Failed - Block user account to 30 minutes
	@Test
	void LoginUser_BlockAccount() {
		String code = "user123";
		String password = "password123";

		UserModel user = new UserModel();
		user.setCode(code);
		user.setPassword("encryptedPassword123");
		user.setStatus(true);
		user.setFailed_attempts(3);
		user.setLock_time(new Timestamp(System.currentTimeMillis()));
		Mockito.when(userRepository.findByCode(code)).thenReturn(Optional.of(user));

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			userService.loginUser(code, password);
		});

		assertEquals("Tu cuenta se encuentra bloqueada por superar los límites de intentos fallidos. Espera 30 minutos para volver a intentarlo.", exception.getMessage());
	}

	//Login user disable account
	@Test
	void LoginUser_DisableAccount() {
		String code = "user123";
		String password = "password123";

		UserModel user = new UserModel();
		user.setCode(code);
		user.setPassword("encryptedPassword123");
		user.setStatus(false);

		Mockito.when(userRepository.findByCode(code)).thenReturn(Optional.of(user));

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			userService.loginUser(code, password);
		});
		assertEquals("Este usuario se encuentra inhabilitado del sistema, por favor contactarse con el administrador.", exception.getMessage());
	}




}
