import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";

export function HourStats({ stats }) {
  const totalPlanned = stats.reduce((sum, item) => sum + item.planned_hours, 0);
  const totalPresent = stats.reduce((sum, item) => sum + item.present_hours, 0);
  const totalLate = stats.reduce((sum, item) => sum + item.late_hours, 0);
  const totalLeave = stats.reduce((sum, item) => sum + item.leave_hours, 0);
  const totalAbsent = stats.reduce((sum, item) => sum + item.absent_hours, 0);
  const totalAttended = stats.reduce((sum, item) => sum + item.attended_hours, 0);
  const totalExpected = stats.reduce((sum, item) => sum + item.expected_total_hours, 0);
  const avgRate = totalExpected
    ? Math.round((totalAttended / totalExpected) * 1000) / 10
    : 0;
  const presentRate = totalExpected ? Math.round((totalPresent / totalExpected) * 1000) / 10 : 0;
  const lateRate = totalExpected ? Math.round((totalLate / totalExpected) * 1000) / 10 : 0;
  const leaveRate = totalExpected ? Math.round((totalLeave / totalExpected) * 1000) / 10 : 0;
  const absentRate = totalExpected ? Math.round((totalAbsent / totalExpected) * 1000) / 10 : 0;

  const barPresent = totalExpected ? (totalPresent / totalExpected) * 100 : 0;
  const barLate = totalExpected ? (totalLate / totalExpected) * 100 : 0;
  const barLeave = totalExpected ? (totalLeave / totalExpected) * 100 : 0;
  const barAbsent = totalExpected ? (totalAbsent / totalExpected) * 100 : 0;

  return (
    <section className="module">
      <div className="metrics-grid metrics-grid-wide">
        <StatCard label="已排课时" value={totalPlanned} helper="按课程时长汇总" />
        <StatCard label="正常出勤" value={totalPresent} helper={`占比 ${presentRate}%`} />
        <StatCard label="迟到课时" value={totalLate} helper={`占比 ${lateRate}% · 按80%折算`} />
        <StatCard label="请假课时" value={totalLeave} helper={`占比 ${leaveRate}% · 按50%折算`} />
        <StatCard label="缺勤课时" value={totalAbsent} helper={`占比 ${absentRate}% · 不计入出勤`} />
        <StatCard label="有效出勤课时" value={totalAttended} helper="折算后合计" />
        <StatCard label="有效出勤率" value={`${avgRate}%`} helper="按总应到课时加权" />
      </div>

      <div className="panel breakdown-panel">
        <div className="breakdown-header">
          <span className="breakdown-title">考勤构成</span>
          <div className="breakdown-legend">
            <span className="legend-item legend-present">正常 {presentRate}%</span>
            <span className="legend-item legend-late">迟到 {lateRate}%</span>
            <span className="legend-item legend-leave">请假 {leaveRate}%</span>
            <span className="legend-item legend-absent">缺勤 {absentRate}%</span>
          </div>
        </div>
        {totalPlanned > 0 ? (
          <>
            <div className="breakdown-bar">
              <div className="breakdown-segment segment-present" style={{ width: `${barPresent}%` }} />
              <div className="breakdown-segment segment-late" style={{ width: `${barLate}%` }} />
              <div className="breakdown-segment segment-leave" style={{ width: `${barLeave}%` }} />
              <div className="breakdown-segment segment-absent" style={{ width: `${barAbsent}%` }} />
            </div>
            <div className="breakdown-summary">
              <span>有效出勤率 <strong>{avgRate}%</strong></span>
              <span>正常全额 + 迟到×0.8 + 请假×0.5 + 缺勤×0</span>
            </div>
          </>
        ) : (
          <div className="breakdown-empty">
            <span className="empty-hint">暂无数据</span>
          </div>
        )}
      </div>

      <div className="table-panel">
        <SectionHeader eyebrow="Hours" title="班级课时统计" />
        <div className="responsive-table">
          <table className="hour-stats-table">
            <thead>
              <tr>
                <th>班级</th>
                <th>学员数</th>
                <th>已排课时</th>
                <th>应到总课时</th>
                <th className="col-present">正常出勤</th>
                <th className="col-late">迟到</th>
                <th className="col-leave">请假</th>
                <th className="col-absent">缺勤</th>
                <th>有效出勤课时</th>
                <th>正常率</th>
                <th>迟到率</th>
                <th>请假率</th>
                <th>缺勤率</th>
                <th>有效出勤率</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item) => {
                if (!item.planned_hours) {
                  return (
                    <tr key={item.class_id} className="row-empty">
                      <td>
                        <strong>{item.class_name}</strong>
                      </td>
                      <td>{item.student_count}</td>
                      <td colSpan={12}>
                        <span className="empty-hint">暂无排课记录</span>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={item.class_id}>
                    <td>
                      <strong>{item.class_name}</strong>
                    </td>
                    <td>{item.student_count}</td>
                    <td>{item.planned_hours}</td>
                    <td>{item.expected_total_hours}</td>
                    <td className="col-present">
                      <span className="status-pill">{item.present_hours}</span>
                    </td>
                    <td className="col-late">
                      <span className="status-pill late">{item.late_hours}</span>
                    </td>
                    <td className="col-leave">
                      <span className="status-pill leave">{item.leave_hours}</span>
                    </td>
                    <td className="col-absent">
                      <span className="status-pill absent">{item.absent_hours}</span>
                    </td>
                    <td>{item.attended_hours}</td>
                    <td>
                      <span className="status-pill">{item.present_rate}%</span>
                    </td>
                    <td>
                      <span className="status-pill late">{item.late_rate}%</span>
                    </td>
                    <td>
                      <span className="status-pill leave">{item.leave_rate}%</span>
                    </td>
                    <td>
                      <span className="status-pill absent">{item.absent_rate}%</span>
                    </td>
                    <td>
                      <span className="status-pill">{item.attendance_rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
