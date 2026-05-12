import Layout from '../../components/Layout/Layout';
import styles from './profile.module.css';

const DOCS = [
  { Icon: CardIcon,     name: 'Banking documents', sub: '4000 **** **** ****\nVisa\nExpires: 07/27' },
  { Icon: BuildingIcon, name: 'Supplier',           sub: 'Metro\ninfo@metro-cc.hr' },
  { Icon: RegisterIcon, name: 'Cash register',      sub: 'Register #345\nConnected' },
];

const EMPLOYEES = [{ name: 'Toni Tonić', email: 'toni.tonic@gmail.com' }];

export default function Profile() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>profile</p>

        <div className={styles.avatarWrap}>

        </div>

        <div className={styles.field}>
          <MailIcon />
          <div className={styles.fieldInfo}>
            <p className={styles.fieldLabel}>E-mail</p>
            <p className={styles.fieldValue}>franko.oceanovic@gmail.com</p>
          </div>
          <EditIcon />
        </div>

        <div className={styles.field}>
        </div>

        <p className={styles.sectionLabel} style={{ marginTop: 10 }}>my documents</p>
        <div className={styles.docGrid}>
          {DOCS.map(({ Icon, name, sub }) => (
            <div key={name} className={styles.docCard}>
              <Icon />
              <p className={styles.docName}>{name}</p>
              {sub.split('\n').map((line, i) => (
                <p key={i} className={styles.docSub}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        {EMPLOYEES.map(emp => (
          <div key={emp.email} className={styles.employeeRow}>
            <PersonAddIcon />
            <div className={styles.employeeInfo}>
              <p className={styles.employeeName}>{emp.name}</p>
              <p className={styles.employeeEmail}>{emp.email}</p>
            </div>
            <EditIcon />
          </div>
        ))}
      </div>
    </Layout>
  );
}
