import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";
import { useProfile } from "../../hooks/useProfile";
import EditModal from "../../components/EditModal/EditModal";
import styles from "./profile.module.css";

const MailIcon = () => <img src="/assets/email.svg" alt="email icon" />;
const PhoneIcon = () => <img src="/assets/phone.svg" alt="phone icon" />;
const EditIcon = () => <img src="/assets/pencil.svg" alt="edit icon" />;
const CardIcon = () => <img src="/assets/card.svg" alt="card icon" />;
const BuildingIcon = () => <img src="/assets/store.svg" alt="store icon" />;
const RegisterIcon = () => <img src="/assets/screen.svg" alt="screen icon" />;
const PersonAddIcon = () => <img src="/assets/profile.svg" alt="person icon" />;
const PlusIcon = () => <img src="/assets/plus.svg" alt="plus icon" />;
const StatIcon = () => <img src="/assets/graph.svg" alt="graph icon" />;

const DOCS = [
  {
    Icon: CardIcon,
    name: "Banking documents",
    sub: "4000 **** **** ****\nVisa\nExpires: 07/27",
  },
  { Icon: BuildingIcon, name: "Supplier", sub: "Metro\ninfo@metro-cc.hr" },
  {
    Icon: RegisterIcon,
    name: "Cash register",
    sub: "Register #345\nConnected",
  },
];

function emailModalConfig(user) {
  return {
    title: "Edit E-mail",
    fields: [
      {
        key: "email",
        label: "E-mail",
        value: user?.email ?? "",
        type: "email",
      },
    ],
  };
}

function phoneModalConfig(user) {
  return {
    title: "Edit Phone",
    fields: [
      { key: "phone", label: "Phone", value: user?.phone ?? "", type: "tel" },
    ],
  };
}

function employeeModalConfig(emp = null) {
  return {
    title: emp ? "Edit Employee" : "Add Employee",
    fields: [
      { key: "name", label: "Name", value: emp?.name ?? "" },
      { key: "email", label: "E-mail", value: emp?.email ?? "", type: "email" },
    ],
  };
}

export default function Profile() {
  const {
    user,
    employees,
    loading,
    saving,
    role,
    updateUserField,
    addEmployee,
    updateEmployee,
  } = useProfile();

  const [modal, setModal] = useState({
    open: false,
    config: null,
    onSave: null,
  });

  const openModal = (config, onSave) =>
    setModal({ open: true, config, onSave });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  if (loading)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>profile</p>

        <div className={styles.avatarWrap}>
          <div className={styles.avatarOuter}>
            <div className={styles.avatar}>
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>Photo</span>
              )}
            </div>
            <button className={styles.avatarEditBtn} aria-label="Edit photo">
              <EditIcon />
            </button>
          </div>
          <p className={styles.role}>{role ?? "—"}</p>
          <p className={styles.name}>
            {user ? `${user.firstName} ${user.lastName}` : "—"}
          </p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <MailIcon />
            <div className={styles.fieldInfo}>
              <p className={styles.fieldLabel}>E-mail</p>
              <p className={styles.fieldValue}>{user?.email ?? "—"}</p>
            </div>
            <button
              className={styles.addBtn}
              aria-label="Edit e-mail"
              onClick={() =>
                openModal(emailModalConfig(user), (vals) =>
                  updateUserField({ email: vals.email })
                )
              }>
              <EditIcon />
            </button>
          </div>

          <div className={styles.field}>
            <PhoneIcon />
            <div className={styles.fieldInfo}>
              <p className={styles.fieldLabel}>Phone</p>
              <p className={styles.fieldValue}>{user?.phone ?? "—"}</p>
            </div>
            <button
              className={styles.addBtn}
              aria-label="Edit phone"
              onClick={() =>
                openModal(phoneModalConfig(user), (vals) =>
                  updateUserField({ phone: vals.phone })
                )
              }>
              <EditIcon />
            </button>
          </div>

          <div className={`${styles.field} ${styles.analyticsField}`}>
            <StatIcon />
            <div className={styles.fieldInfo}>
              <p>View Analytics</p>
            </div>
          </div>
        </div>

        <p className={styles.sectionLabel}>my documents</p>
        <div className={styles.docGrid}>
          {DOCS.map(({ Icon, name, sub }) => (
            <div key={name} className={styles.docCard}>
              <Icon />
              <p className={styles.docName}>{name}</p>
              {sub.split("\n").map((line, i) => (
                <p key={i} className={styles.docSub}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {role === "ADMIN" && (
          <>
            <div className={styles.addEmployeesRow}>
              <p className={styles.sectionLabel}>add employees</p>
              <button
                className={styles.addBtn}
                aria-label="Add employee"
                onClick={() =>
                  openModal(employeeModalConfig(null), (vals) =>
                    addEmployee({ name: vals.name, email: vals.email })
                  )
                }>
                <PlusIcon />
              </button>
            </div>

            {employees.map((emp) => (
              <div key={emp.id ?? emp.email} className={styles.employeeRow}>
                <PersonAddIcon />
                <div className={styles.employeeInfo}>
                  <p className={styles.employeeName}>{emp.name}</p>
                  <p className={styles.employeeEmail}>{emp.email}</p>
                </div>
                <button
                  className={styles.addBtn}
                  aria-label={`Edit ${emp.name}`}
                  onClick={() =>
                    openModal(employeeModalConfig(emp), (vals) =>
                      updateEmployee(emp.id, {
                        name: vals.name,
                        email: vals.email,
                      })
                    )
                  }>
                  <EditIcon />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {modal.config && (
        <EditModal
          open={modal.open}
          onClose={closeModal}
          onSave={modal.onSave}
          title={modal.config.title}
          fields={modal.config.fields}
          saving={saving}
        />
      )}
    </Layout>
  );
}
