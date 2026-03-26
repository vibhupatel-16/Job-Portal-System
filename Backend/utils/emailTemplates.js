// backend/utils/emailTemplates.js

export const jobPostingTemplate = (title, location, jobType, experience, salary, description) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; margin: 0; color: #374151;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #1d4ed8; padding: 40px 30px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <svg style="width: 28px; height: 28px; color: white; margin-right: 12px; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; display: inline-block; vertical-align: middle;">New Job Opportunity</h1>
            </div>
            <p style="color: #e0e7ff; margin: 0; font-size: 16px;">We're Hiring: ${title}</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Dear Candidate,</p>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                We are excited to announce an opening for a <b>${title}</b> position at our company. We believe your skills and experience would be a perfect fit for our dynamic team.
            </p>
            
            <!-- Details Box -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px;">Position Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #475569; font-weight: 600; width: 35%;">Position:</td>
                        <td style="padding: 8px 0; color: #64748b;">${title}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #475569; font-weight: 600;">Location:</td>
                        <td style="padding: 8px 0; color: #64748b;">${location}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #475569; font-weight: 600;">Employment:</td>
                        <td style="padding: 8px 0; color: #64748b;">${jobType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #475569; font-weight: 600;">Experience:</td>
                        <td style="padding: 8px 0; color: #64748b;">${experience} Years</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #475569; font-weight: 600;">Salary:</td>
                        <td style="padding: 8px 0; color: #64748b;">₹${salary}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">Description:</h3>
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0;">
                     ${description.length > 300 ? description.substring(0, 300) + '...' : description}
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="http://localhost:5173/jobs" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                    Apply Now
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} JobPortal Inc. | All rights reserved
            </p>
        </div>
    </div>
</body>
</html>
`;

export const applicationStatusTemplate = (applicantName, jobTitle, status, statusColor) => {
    let headerText = "Application Update";
    let subHeaderText = "Updates regarding your application process.";
    let headerBgColor = "#8b5cf6"; // Default purple
    let alertBoxHtml = "";
    let nextStepsHtml = "";
    
    // Status Logic Routing
    if (status === "shortlisted") {
        headerText = "Application Update";
        subHeaderText = "Great news about your application!";
        headerBgColor = "#8b5cf6"; // Purple
        
        alertBoxHtml = `
            <div style="background-color: #fdf5ff; border-left: 4px solid #a855f7; border-radius: 4px; padding: 20px; margin: 25px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <svg style="width: 24px; height: 24px; color: #a855f7; margin-right: 12px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 style="margin: 0 0 8px 0; color: #581c87; font-size: 16px;">Congratulations!</h4>
                        <p style="margin: 0; color: #7e22ce; font-size: 14px; line-height: 1.5;">Your qualifications and experience have impressed our hiring team. We would like to move forward with the next stage of the recruitment process.</p>
                    </div>
                </div>
            </div>
        `;

        nextStepsHtml = `
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">Next Steps</h3>
                <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">1. Our recruitment team will review your profile further.</p>
                <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">2. Prepare your portfolio and showcase materials further.</p>
                <p style="color: #475569; font-size: 14px; margin: 0;">3. Ensure your availability for potential upcoming interviews.</p>
            </div>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Our recruitment team will contact you within <b>3-5 business days</b> to schedule the next contact.</p>
        `;

    } else if (status === "accepted") {
        headerText = "Offer Accepted";
        subHeaderText = "Welcome to the team!";
        headerBgColor = "#16a34a"; // Green
        
        alertBoxHtml = `
            <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                <svg style="width: 48px; height: 48px; color: #16a34a; margin: 0 auto 15px auto; display: block;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 style="margin: 0 0 10px 0; color: #166534; font-size: 22px;">Welcome Aboard!</h2>
                <p style="margin: 0; color: #15803d; font-size: 15px; line-height: 1.5;">We're excited to have you join our team and look forward to working with you.</p>
            </div>
        `;

    } else if (status === "rejected") {
        headerText = "Application Status";
        subHeaderText = "An update regarding your profile.";
        headerBgColor = "#475569"; // Slate gray
        
        alertBoxHtml = `
            <div style="background-color: #f8fafc; border-left: 4px solid #64748b; border-radius: 4px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">Thank you for your time. After careful consideration, we have decided to move forward with other candidates whose profiles more closely match our current needs for the <b>${jobTitle}</b> role.</p>
            </div>
        `;
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; margin: 0; color: #374151;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background-color: ${headerBgColor}; padding: 35px 30px; color: white;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <svg style="width: 24px; height: 24px; color: white; margin-right: 12px; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; display: inline-block; vertical-align: middle;">${headerText}</h1>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 15px;">${subHeaderText}</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Dear ${applicantName},</p>
            
            ${status === 'accepted' ? `<p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Congratulations! We are thrilled to confirm that <b>your job application has been accepted</b> and you will be moving to the final onboarding stage for the <b>${jobTitle}</b> role.</p>` : ''}
            
            ${status === 'shortlisted' ? `<p style="font-size: 15px; color: #4b5563; line-height: 1.6;">We are pleased to inform you that after careful review of all applications, <b>you have been shortlisted</b> for the position of <b>${jobTitle}</b>.</p>` : ''}

            ${alertBoxHtml}
            ${nextStepsHtml}

            <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
                <a href="http://localhost:5173/jobseeker/dashboard" style="background-color: ${headerBgColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
                    View Application Status
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} JobPortal Inc. | All rights reserved
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export const interviewScheduleTemplate = (applicantName, jobTitle, companyName, date, time, mode, meetLink, calendarUrl, resumeUrl, isReschedule = false) => {
    const headerText = isReschedule ? "Reschedule Approved" : "Interview Invitation";
    const subHeaderText = isReschedule ? "Your new interview details." : "You've been invited to an interview!";
    const headerBgColor = isReschedule ? "#0ea5e9" : "#6366f1"; // Blue or Indigo
    const accentColor = isReschedule ? "#0284c7" : "#4f46e5";

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; margin: 0; color: #374151;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background-color: ${headerBgColor}; padding: 35px 30px; color: white;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <svg style="width: 24px; height: 24px; color: white; margin-right: 12px; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; display: inline-block; vertical-align: middle;">${headerText}</h1>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 15px;">${subHeaderText}</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Dear ${applicantName},</p>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                ${isReschedule 
                    ? `Your request to reschedule the interview for the <b>${jobTitle}</b> position at <b>${companyName}</b> has been approved.` 
                    : `We are pleased to invite you to an interview for the <b>${jobTitle}</b> position at <b>${companyName}</b>.`}
            </p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${headerBgColor};">
                <h3 style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">Logistics</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: #475569; font-weight: 600; width: 30%;">Date:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #475569; font-weight: 600;">Time:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #475569; font-weight: 600;">Format:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${mode.toUpperCase()}</td>
                    </tr>
                </table>
            </div>

            <!-- Action Area -->
            <div style="text-align: center; margin-top: 35px; margin-bottom: 20px;">
                ${mode === "online" && meetLink ? `
                    <a href="${meetLink}" style="background-color: ${accentColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; margin-bottom: 15px;">
                        Join Virtual Interview
                    </a>
                ` : ""}
                
                ${calendarUrl ? `<br/><a href="${calendarUrl}" style="color: ${accentColor}; text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid ${accentColor}; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                    Add to Google Calendar
                </a>` : ''}

                <!-- RESUME LINK INJECTION -->
                ${resumeUrl ? `<div style="margin-top: 25px; padding-top: 20px; border-top: 1px dotted #cbd5e1;">
                    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Reference the candidate's active profile:</p>
                    <a href="${resumeUrl}" style="color: #6366f1; text-decoration: underline; font-size: 14px; font-weight: 600;">View Candidate Resume</a>
                </div>` : ''}

            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} JobPortal Inc. | All rights reserved
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export const forgotPasswordTemplate = (userName, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; margin: 0; color: #374151;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #ef4444; padding: 40px 30px; text-align: center;">
            <svg style="width: 48px; height: 48px; color: white; margin: 0 auto 10px auto; display: block;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">Password Reset Request</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Hello ${userName || "User"},</p>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                We received a request to reset the password for your JobPortal account. If you made this request, please click the button below to set a new password.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" style="background-color: #ef4444; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.4);">
                    Reset Password
                </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                <b style="color: #ef4444;">Note:</b> This link will expire in <b>15 minutes</b>. If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} JobPortal Inc. | All rights reserved
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Security Alert: Never share this link with anyone.
            </p>
        </div>
    </div>
</body>
</html>
`;
