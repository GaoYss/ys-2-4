from app.data.store import store
from app.services.scheduler import enrich_session


ATTENDANCE_WEIGHT = {
    "present": 1,
    "late": 0.8,
    "leave": 0.5,
    "absent": 0,
}


def calculate_hour_stats():
    sessions = [enrich_session(item) for item in store.schedule]
    stats = []

    for training_class in store.classes:
        class_sessions = [
            item for item in sessions if item["class_id"] == training_class["id"]
        ]
        planned_hours = sum(item["duration"] for item in class_sessions)
        student_count = len(training_class["students"])
        attendance_records = [
            item
            for item in store.attendance
            if any(session["id"] == item["session_id"] for session in class_sessions)
        ]

        present_hours = 0
        late_hours = 0
        leave_hours = 0
        absent_hours = 0
        attended_hours = 0

        for record in attendance_records:
            session = next(
                item for item in class_sessions if item["id"] == record["session_id"]
            )
            duration = session["duration"]
            status = record["status"]
            if status == "present":
                present_hours += duration
            elif status == "late":
                late_hours += duration
            elif status == "leave":
                leave_hours += duration
            elif status == "absent":
                absent_hours += duration
            attended_hours += duration * ATTENDANCE_WEIGHT.get(status, 0)

        expected_total = planned_hours * student_count
        attendance_rate = round((attended_hours / expected_total) * 100, 1) if expected_total else 0
        present_rate = round((present_hours / expected_total) * 100, 1) if expected_total else 0
        late_rate = round((late_hours / expected_total) * 100, 1) if expected_total else 0
        leave_rate = round((leave_hours / expected_total) * 100, 1) if expected_total else 0
        absent_rate = round((absent_hours / expected_total) * 100, 1) if expected_total else 0

        stats.append(
            {
                "class_id": training_class["id"],
                "class_name": training_class["name"],
                "planned_hours": planned_hours,
                "student_count": student_count,
                "expected_total_hours": expected_total,
                "present_hours": round(present_hours, 1),
                "late_hours": round(late_hours, 1),
                "leave_hours": round(leave_hours, 1),
                "absent_hours": round(absent_hours, 1),
                "attended_hours": round(attended_hours, 1),
                "attendance_rate": attendance_rate,
                "present_rate": present_rate,
                "late_rate": late_rate,
                "leave_rate": leave_rate,
                "absent_rate": absent_rate,
            }
        )

    return stats
