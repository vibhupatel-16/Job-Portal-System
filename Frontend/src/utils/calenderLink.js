export const generateGoogleCalendarLink = (interview) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    
    const text = encodeURIComponent(`Interview for ${interview?.job?.title || 'Job'}`);
    const details = encodeURIComponent(`Meeting Link: ${interview?.meetingLink}\nCompany: ${interview?.company?.name}`);
    
    // 2. Date Formatting (Google format: YYYYMMDDTHHmmSSZ)
    const startDateTime = new Date(`${interview.date}T${interview.time}:00`).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const endDateTime = new Date(new Date(`${interview.date}T${interview.time}:00`).getTime() + 3600000)
        .toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `${baseUrl}&text=${text}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${encodeURIComponent(interview.meetingLink)}`;
};