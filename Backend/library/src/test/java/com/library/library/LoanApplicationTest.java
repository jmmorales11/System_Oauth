package com.library.library;

import com.library.library.DTO.BinacleDTO;
import com.library.library.DTO.LoanUserBookDTO;
import com.library.library.models.BookModel;
import com.library.library.models.LoanModel;
import com.library.library.models.UserModel;
import com.library.library.repositories.IBookRepository;
import com.library.library.repositories.ILoanRepository;
import com.library.library.repositories.IUserRepository;
import com.library.library.services.BookService;
import com.library.library.services.LoanService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class LoanApplicationTest {

	@InjectMocks
	private LoanService loanService;

	@Mock
	private BookService bookService;

	@Mock
	private ILoanRepository loanRepository;
	@Mock
	private IBookRepository bookRepository;

	@Mock
	private IUserRepository userRepository;

	//Get all loans successful
	@Test
	void getAllLoan_Success() {
		LoanModel loan1 = new LoanModel();
		LoanModel loan2 = new LoanModel();
		List<LoanModel> loanList = List.of(loan1, loan2);

		when(loanRepository.findAll()).thenReturn(loanList);

		List<LoanModel> result = loanService.getAllLoan();

		assertNotNull(result);
		assertEquals(2, result.size());
	}

	// Get all Loans Exception
	@Test
	void getAllLoan_BooksRegisterIsEmpty() {
		when(loanRepository.findAll()).thenReturn(Collections.emptyList());

		List<LoanModel> loans = loanService.getAllLoan();
		assertNotNull(loans);
		assertTrue(loans.isEmpty(),"Se esperaba que la lista de préstamos estuviera vacía");
	}

	//Get All Loans Error
	@Test
	void getAllLoans_DatabaseError() {
		when(loanRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

		try {
			loanService.getAllLoan();
			fail("Se esperaba una excepción RuntimeException");
		} catch (RuntimeException e) {
			assertEquals("Error al obtener la lista de préstamos", e.getMessage());
		}
	}

	/*---------------------------------------------------------------------------------------------------*/
	//Get some User, Book and Loan data successful
	@Test
	void getAllLoanUserBook_Success() {
		LoanModel loan = new LoanModel();
		loan.setIdloan(1);
		loan.setAcquisition_date(new Date());
		loan.setDate_of_devolution(new Date());
		loan.setConfirm_devolution(false);

		UserModel user = new UserModel();
		user.setCode("U001");
		user.setUser_name("John");
		user.setUser_last_name("Doe");
		loan.setUser(user);

		BookModel book = new BookModel();
		book.setCode("B001");
		book.setTitle("Book Title");
		loan.setBook(book);

		when(loanRepository.findAll()).thenReturn(List.of(loan));

		List<LoanUserBookDTO> result = loanService.getAllLoanUserBook();

		assertNotNull(result);
		assertEquals(1, result.size());
		assertEquals("Book Title", result.get(0).getTitle());
		assertEquals("John", result.get(0).getUser_name());
	}

	/*------------------------------------------------------------------------------------------*/
	//Get Binnacle
	@Test
	void getDataBinnacle_Success() {
		LoanModel loan = new LoanModel();
		loan.setAcquisition_date(new Date());
		loan.setDate_of_devolution(new Date());

		BookModel book = new BookModel();
		book.setCode("B001");
		book.setAuthor("Author Name");
		loan.setBook(book);

		UserModel user = new UserModel();
		user.setUser_name("John");
		loan.setUser(user);

		when(loanRepository.findAll()).thenReturn(List.of(loan));

		List<BinacleDTO> result = loanService.getDataBinnacle();

		assertNotNull(result);
		assertEquals(1, result.size());
		assertEquals("Author Name", result.get(0).getAuthor());
	}

	/*----------------------------------------------------------------------------------------------------------*/
	//Save loan successful
	@Test
	void saveLoan_Success() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, 1);
		LoanModel loan = new LoanModel();
		loan.setDate_of_devolution(calendar.getTime());

		UserModel user = new UserModel();
		user.setId_user(1);
		loan.setUser(user);

		BookModel book = new BookModel();
		book.setId_book(1);
		book.setStatus(true);
		loan.setBook(book);

		when(userRepository.findById(1)).thenReturn(Optional.of(user));
		when(bookRepository.findById(1)).thenReturn(Optional.of(book));
		when(loanRepository.save(any(LoanModel.class))).thenReturn(loan);

		LoanModel result = loanService.saveLoan(loan);

		assertNotNull(result);
		assertEquals(loan, result);

		verify(bookRepository, times(1)).save(book);
	}

	//returned loan
	@Test
	void returnedBook_Success() {
		LoanModel loan = new LoanModel();
		loan.setIdloan(1);
		loan.setDate_of_devolution(new Date());
		loan.setConfirm_devolution(false);

		BookModel book = new BookModel();
		book.setId_book(1);
		book.setStatus(false);
		loan.setBook(book);

		when(loanRepository.findById(1)).thenReturn(Optional.of(loan));
		when(loanRepository.save(any(LoanModel.class))).thenReturn(loan);

		LoanModel result = loanService.returnedBook(loan,1);

		assertNotNull(result);
		assertTrue(result.isConfirm_devolution());
		assertTrue(book.isStatus());
	}

	//update loan
	@Test
	void updateLoan_Success() {
		LoanModel existingLoan = new LoanModel();
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, 1);
		existingLoan.setIdloan(1);
		existingLoan.setDate_of_devolution(calendar.getTime());

		Calendar calendar2 = Calendar.getInstance();
		calendar2.add(Calendar.DATE, 3);
		LoanModel updatedLoan = new LoanModel();
		updatedLoan.setDate_of_devolution(calendar2.getTime());

		when(loanRepository.findById(1)).thenReturn(Optional.of(existingLoan));
		when(loanRepository.save(any(LoanModel.class))).thenReturn(updatedLoan);

		LoanModel result = loanService.updateLoan(updatedLoan, 1);

		assertNotNull(result);
		assertEquals(calendar2.getTime(), result.getDate_of_devolution());
	}


	//Obtener ranking book
	@Test
	void getRankingBooks_Success() {
		// Configurar datos simulados
		LoanModel loan1 = new LoanModel();
		BookModel book1 = new BookModel();
		book1.setTitle("Book 1");
		book1.setAuthor("Author 1");
		book1.setDescription("Description 1");
		book1.setLanguage("English");
		book1.setGrade("Grade A");
		loan1.setBook(book1);
		loan1.setConfirm_devolution(true);

		LoanModel loan2 = new LoanModel();
		BookModel book2 = new BookModel();
		book2.setTitle("Book 2");
		book2.setAuthor("Author 2");
		book2.setDescription("Description 2");
		book2.setLanguage("Spanish");
		book2.setGrade("Grade B");
		loan2.setBook(book2);
		loan2.setConfirm_devolution(true);

		// Libro no prestado
		BookModel book3 = new BookModel();
		book3.setTitle("Book 3");
		book3.setAuthor("Author 3");
		book3.setDescription("Description 3");
		book3.setLanguage("French");
		book3.setGrade("Grade C");

		// Configurar comportamiento de los mocks
		when(loanRepository.findAll()).thenReturn(List.of(loan1, loan2));
		when(bookService.getAllBooks()).thenReturn(List.of(book1, book2, book3));

		// Llamar al metodo a probar
		List<Map<String, Object>> result = loanService.getRankingBooks();

		// Verificar los resultados
		assertNotNull(result);
		assertEquals(3, result.size());

		// Verificar el orden del ranking
		assertEquals("Book 1", result.get(0).get("title"));
		assertEquals("Author 1", result.get(0).get("author"));
		assertEquals(1, result.get(0).get("loan_count"));

		assertEquals("Book 2", result.get(1).get("title"));
		assertEquals("Author 2", result.get(1).get("author"));
		assertEquals(1, result.get(1).get("loan_count"));

		assertEquals("Book 3", result.get(2).get("title"));
		assertEquals("Author 3", result.get(2).get("author"));
		assertEquals(0, result.get(2).get("loan_count"));

		// Verificar interacción con los mocks
		verify(loanRepository, times(1)).findAll();
		verify(bookService, times(1)).getAllBooks();
	}




	//ranking de los estudiantes
	@Test
	void getRankingStudents_Success() {
		LoanModel loan1 = new LoanModel();
		UserModel user1 = new UserModel();
		user1.setId_user(1);
		user1.setUser_name("John");
		user1.setUser_last_name("Doe");
		user1.setGrade("A");
		user1.setCode("1234");
		loan1.setUser(user1);
		loan1.setConfirm_devolution(true);

		LoanModel loan2 = new LoanModel();
		UserModel user2 = new UserModel();
		user2.setId_user(2);
		user2.setUser_name("Jane");
		user2.setUser_last_name("Smith");
		user2.setGrade("B");
		user2.setCode("5678");
		loan2.setUser(user2);
		loan2.setConfirm_devolution(true);

		LoanModel loan3 = new LoanModel();
		UserModel user3 = new UserModel();
		user3.setId_user(1);
		user3.setUser_name("John");
		user3.setUser_last_name("Doe");
		user3.setGrade("A");
		user3.setCode("1234");
		loan3.setUser(user3);
		loan3.setConfirm_devolution(true);

		when(loanRepository.findAll()).thenReturn(List.of(loan1, loan2, loan3));

		List<Map<String, Object>> result = loanService.getRankingStudents();

		assertNotNull(result);
		assertEquals(2, result.size()); // Debería haber 2 usuarios únicos

		assertEquals("John", result.get(0).get("firstName"));
		assertEquals(2, result.get(0).get("count"));

		assertEquals("Jane", result.get(1).get("firstName"));
		assertEquals(1, result.get(1).get("count"));
	}

}
