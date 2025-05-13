function redirectTo(page) {
    window.location.href = page;
}

function goBack() {
    window.location.href = "Mainpage.html";
}

const students = ["Abhijith", "Amritha", "Anbarasan","Anirudha","Rithvikesh","Jithin sai","Mounesh","Sree charan","Yashwanth","Dhanush","Karthiga","Karthikeyan","Kisoth kumar","Krishna sai","Leela vinothini","Lekshmi Nair","Logesh","Lohith","Mugesh","Nikhilesh","Bhanu prakash","Praneethwaran","Vidhushaa","Ramani","Tanoj","Reema shri","Rohith surya","rudra kumar","Abubakar","Shivakarthik","Sree nikesh","Suba sree","Tarun","Harshamithiran","Sanath","Balaram Pratheek","Sravan","Yadhukrishna","Promodh","Ramya sri","Praveen","Swaraj","Nikhil reddy","Adwaith","Harshini","Sabari","Hemavathi","Imran","Akash","Abhinav","Krishanunni","Sriram","Sanskrithi krishna","Krishna vardhana","Majunu"];
let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
let attendanceSummary = JSON.parse(localStorage.getItem("attendanceSummary")) || {};

// Initialize summary for each student
students.forEach(student => {
    if (!attendanceSummary[student]) {
        attendanceSummary[student] = { totalClasses: 0, totalPresent: 0 };
    }
});

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("studentList")) {
        loadTeacherView();
    } else if (document.getElementById("studentAttendance")) {
        loadStudentView();
    }
});

function loadTeacherView() {
    let tableBody = document.getElementById("studentList");
    tableBody.innerHTML = "";

    students.forEach(student => {
        let row = `
            <tr>
                <td>${student}</td>
                <td><input type="radio" name="${student}" value="Present"></td>
                <td><input type="radio" name="${student}" value="Absent"></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function submitAttendance() {
    let date = document.getElementById("attendanceDate").value;
    let period = document.getElementById("periodSelect").value;
    let subject = document.getElementById("subjectSelect").value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    students.forEach(student => {
        let status = document.querySelector(`input[name="${student}"]:checked`);
        if (status) {
            // Update attendance records
            attendanceRecords.push({
                student: student,
                date: date,
                period: period,
                subject: subject,
                status: status.value
            });

            // Update summary
            attendanceSummary[student].totalClasses++;
            if (status.value === "Present") {
                attendanceSummary[student].totalPresent++;
            }
        }
    });

    // Save data in local storage
    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    localStorage.setItem("attendanceSummary", JSON.stringify(attendanceSummary));

    alert("Attendance Submitted Successfully!");
        // ✅ Refresh the page to reset details for the next teacher
    location.reload();

}

function loadStudentView() {
    let attendanceTable = document.getElementById("studentAttendance");
    let studentName = prompt("Enter your name:");

    if (!students.includes(studentName)) {
        alert("Student not found!");
        return;
    }

    let studentRecords = attendanceRecords.filter(record => record.student === studentName);
    attendanceTable.innerHTML = "";

    studentRecords.forEach(record => {
        let row = `
            <tr>
                <td>${record.date}</td>
                <td>${record.period}</td>
                <td>${record.subject}</td>
                <td>${record.status}</td>
            </tr>
        `;
        attendanceTable.innerHTML += row;
    });

    if (studentRecords.length === 0) {
        attendanceTable.innerHTML = "<tr><td colspan='4'>No records found</td></tr>";
    }

    // Calculate attendance percentage
    let totalClasses = attendanceSummary[studentName].totalClasses;
    let totalPresent = attendanceSummary[studentName].totalPresent;
    let percentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;

    // Show percentage
    let percentageDisplay = document.createElement("h3");
    percentageDisplay.innerHTML = `Attendance Percentage: <b>${percentage}%</b>`;
    document.querySelector(".container").appendChild(percentageDisplay);
}
