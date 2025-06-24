export interface RecentQueryFeed {
  pid: number;
  username: string;
  application_name: string;
  client_addr: string;
  client_hostname: string | null;
  client_port: number;
  backend_start: string;
  query_start: string;
  state_change: string;
  state: string;
  query: string;
  query_duration: string;
  state_duration: string;
  connection_duration: string;
}
