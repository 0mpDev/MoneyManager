package com.patniom3.moneymanager.service;

import com.patniom3.moneymanager.dto.ExpenseDTO;
import com.patniom3.moneymanager.entity.ProfileEntity;
import com.patniom3.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;


    @Scheduled(cron = "0 0 22 * * *" ,zone="IST" )
    public void sendDailyIncomeExpenseRemainder(){
        log.info("Job started: sendDailyIncomeExpenseRemainder()");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for(ProfileEntity profile : profiles){
            String body = "Hi " + profile.getFullName() + ",<br><br>"
                    + "This is a friendly reminder to add your income and expenses for today in Money Manager.<br><br>"
                    + "<a href=\"" + frontendUrl + "\" style=\"display:inline-block; padding:10px 20px; background-color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;\">"
                    + "Go to Money Manager</a>"
                    + "<br><br>Best regards,<br>Money Manager Team";

            emailService.sendEmail(profile.getEmail(), "Daily reminder : Add your income and expenses", body);
        }

    }
    @Scheduled(cron = "0 0 23 * * *" ,zone="IST" )
    public void sendDailyExpenseSummary(){
        log.info("Job started : sendDailyExpenseSummary()");
       List<ProfileEntity> profiles = profileRepository.findAll();
       for(ProfileEntity profile : profiles){
           List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());
           if(!todaysExpenses.isEmpty()){
               StringBuilder table = new StringBuilder();

                // table.append("<tr style ='background-color:#f2f2f2'><th style = 'border:1px solid #ddd;padding:8px;'>Name</th><th style ='border:1px solid #ddd;padding:'");
               table.append("<h3>Today's Expenses Summary</h3>");
               table.append("<table style='border-collapse:collapse;width:100%'>");
               table.append("<tr style='background-color:#f2f2f2'>")
                       .append("<th style='border:1px solid #ddd;padding:8px;'>S.No.</th>")
                       .append("<th style='border:1px solid #ddd;padding:8px;'>Name</th>")
                       .append("<th style='border:1px solid #ddd;padding:8px;'>Amount</th>")
                       .append("<th style='border:1px solid #ddd;padding:8px;'>Category</th>")
                       .append("</tr>");

               int index = 1;
               for (ExpenseDTO expense : todaysExpenses) {
                   table.append("<tr>")
                           .append("<td style='border:1px solid #ddd;padding:8px;'>").append(index++).append("</td>")
                           .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getName()).append("</td>")
                           .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getAmount()).append("</td>")
                           .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getCategoryId() != null ? expense.getCategoryName():"N/A").append("</td>")
                           .append("</tr>");
               }
               table.append("</table>");
               String body = "Hi " + profile.getFullName()+",<br/><br/> Here is a summary of your expenses for today:<br/><br/>"+table+"<br/><br/> Best regards, <br/> Money Manager Team";
               emailService.sendEmail(profile.getEmail(), "Your daily expense summary",body);
           }
       }
        log.info("Job completed : sendDailyExpenseSummary()");
    }

}
