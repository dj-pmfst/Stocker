import Layout from "../../components/Layout/Layout";
import styles from "./profile.module.css";

const MailIcon = () => <img src="/assets/email.svg" />;
const PhoneIcon = () => <img src="/assets/phone.svg" />;
const EditIcon = () => <img src="/assets/pencil.svg" />;
const CardIcon = () => <img src="/assets/card.svg" />;
const BuildingIcon = () => <img src="/assets/store.svg" />;
const RegisterIcon = () => <img src="/assets/screen.svg" />;
const PersonAddIcon = () => <img src="/assets/profile.svg" />;
const PlusIcon = () => <img src="/assets/plus.svg" />;
const StatIcon = () => <img src="/assets/graph.svg"/>;

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

const EMPLOYEES = [{ name: "Toni Tonić", email: "toni.tonic@gmail.com" }];

export default function Profile() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>profile</p>

        <div className={styles.avatarWrap}>
          <div className={styles.avatarOuter}>
            <div className={styles.avatar}>
              <span>Photo</span>
            </div>
            <button className={styles.avatarEditBtn}>
              <EditIcon />
            </button>
          </div>
          <p className={styles.role}>Admin</p>
          <p className={styles.name}>Franko Oceanović</p>
        </div>

      <div className={styles.fieldGrid}>
                <div className={styles.field}>
          <MailIcon />
          <div className={styles.fieldInfo}>
            <p className={styles.fieldLabel}>E-mail</p>
            <p className={styles.fieldValue}>franko.oceanovic@gmail.com</p>
          </div>
          <button className={styles.addBtn}><EditIcon /></button>
        </div>

        <div className={styles.field}>
          <PhoneIcon />
          <div className={styles.fieldInfo}>
            <p className={styles.fieldLabel}>Phone</p>
            <p className={styles.fieldValue}>099 123 4567</p>
          </div>
          <button className={styles.addBtn}><EditIcon /></button>
        </div>

        <div className={`${styles.field} ${styles.analyticsField}`}>
          <StatIcon />
          <div className={styles.fieldInfo}>
            <p>View Analytics</p>
          </div>
        </div>

      </div>

        <p className={styles.sectionLabel}>
          my documents
        </p>
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

        <div className={styles.addEmployeesRow}>
          <p className={styles.sectionLabel}>
            add employees
          </p>
          <button className={styles.addBtn}>
            <PlusIcon />
          </button>
          
        </div>

        {EMPLOYEES.map((emp) => (
          <div key={emp.email} className={styles.employeeRow}>
            <PersonAddIcon />
            <div className={styles.employeeInfo}>
              <p className={styles.employeeName}>{emp.name}</p>
              <p className={styles.employeeEmail}>{emp.email}</p>
            </div>
            <button className={styles.addBtn}><EditIcon /></button>
            
          </div>
        ))}
      </div>
    </Layout>
  );
}
